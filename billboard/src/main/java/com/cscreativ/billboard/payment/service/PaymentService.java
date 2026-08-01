package com.cscreativ.billboard.payment.service;

import com.cscreativ.billboard.billboard.BillboardFacade;
import com.cscreativ.billboard.booking.BookingFacade;
import com.cscreativ.billboard.booking.events.OrderCreatedEvent;
import com.cscreativ.billboard.payment.PaymentFacade;
import com.cscreativ.billboard.payment.domain.Payment;
import com.cscreativ.billboard.payment.domain.PaymentMethod;
import com.cscreativ.billboard.payment.domain.PaymentRepository;
import com.cscreativ.billboard.payment.domain.PaymentStatus;
import com.cscreativ.billboard.payment.domain.Wallet;
import com.cscreativ.billboard.payment.domain.WalletRepository;
import com.cscreativ.billboard.payment.events.OrderPaidEvent;
import com.cscreativ.billboard.shared.domain.Money;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;

/**
 * Handles the automated split of funds between the platform commission and the
 * regisseurs' wallets once an order has been paid. This is the Phase 2 "escrow
 * engine" foundation described in the product spec, wired here at MVP scope.
 */
@Service
@Transactional
public class PaymentService implements PaymentFacade {

    private static final BigDecimal PLATFORM_COMMISSION_RATE = new BigDecimal("0.10");

    private final PaymentRepository paymentRepository;
    private final WalletRepository walletRepository;
    private final BookingFacade bookingFacade;
    private final BillboardFacade billboardFacade;
    private final ApplicationEventPublisher eventPublisher;

    PaymentService(
            PaymentRepository paymentRepository,
            WalletRepository walletRepository,
            BookingFacade bookingFacade,
            BillboardFacade billboardFacade,
            ApplicationEventPublisher eventPublisher) {
        this.paymentRepository = paymentRepository;
        this.walletRepository = walletRepository;
        this.bookingFacade = bookingFacade;
        this.billboardFacade = billboardFacade;
        this.eventPublisher = eventPublisher;
    }

    @Override
    public Optional<PaymentSummary> findByOrderId(UUID orderId) {
        return paymentRepository.findByOrderId(orderId).map(PaymentService::toSummary);
    }

    @Override
    public Money getWalletBalance(UUID ownerId) {
        return walletRepository.findByOwnerId(ownerId)
                .map(w -> new Money(w.getBalance(), w.getCurrency()))
                .orElse(Money.zero("XOF"));
    }

    @EventListener
    void onOrderCreated(OrderCreatedEvent event) {
        Payment payment = new Payment(event.orderId(), event.payerId(), event.totalAmount(), event.currency());
        paymentRepository.save(payment);
    }

    /** Captures the payment, escrows the funds and immediately splits them to the regisseurs' wallets. */
    public Payment pay(UUID orderId, PaymentMethod method, UUID requesterId) {
        if (!bookingFacade.resolvePayerId(orderId).equals(requesterId)) {
            throw new IllegalStateException("Order %s does not belong to %s".formatted(orderId, requesterId));
        }

        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new NoSuchElementException("No payment initialized for order " + orderId));

        if (payment.getStatus() != PaymentStatus.PENDING) {
            throw new IllegalStateException("Payment for order %s is already %s".formatted(orderId, payment.getStatus()));
        }

        payment.setMethod(method);
        payment.setStatus(PaymentStatus.ESCROWED);
        paymentRepository.save(payment);

        splitFundsToRegisseurs(orderId);

        payment.setStatus(PaymentStatus.RELEASED);
        payment.setSettledAt(java.time.Instant.now());
        paymentRepository.save(payment);

        bookingFacade.markOrderPaid(orderId);
        eventPublisher.publishEvent(new OrderPaidEvent(orderId, payment.getId(), payment.getAmount(), payment.getCurrency()));
        return payment;
    }

    private void splitFundsToRegisseurs(UUID orderId) {
        BookingFacade.OrderSummary order = bookingFacade.getById(orderId);

        for (BookingFacade.OrderItemSummary item : order.items()) {
            UUID regisseurId = billboardFacade.getById(item.billboardId()).ownerId();
            BigDecimal commission = item.unitPrice().amount().multiply(PLATFORM_COMMISSION_RATE)
                    .setScale(2, RoundingMode.HALF_UP);
            BigDecimal regisseurShare = item.unitPrice().amount().subtract(commission);

            Wallet wallet = walletRepository.findByOwnerId(regisseurId)
                    .orElseGet(() -> walletRepository.save(new Wallet(regisseurId, item.unitPrice().currency())));
            wallet.credit(regisseurShare);
            walletRepository.save(wallet);
        }
    }

    private static PaymentSummary toSummary(Payment p) {
        return new PaymentSummary(
                p.getId(), p.getOrderId(), p.getPayerId(),
                new Money(p.getAmount(), p.getCurrency()), p.getMethod(), p.getStatus());
    }
}
