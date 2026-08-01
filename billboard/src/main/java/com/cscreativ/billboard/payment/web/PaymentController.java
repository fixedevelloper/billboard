package com.cscreativ.billboard.payment.web;

import com.cscreativ.billboard.payment.domain.Payment;
import com.cscreativ.billboard.payment.domain.PaymentMethod;
import com.cscreativ.billboard.payment.domain.PaymentRepository;
import com.cscreativ.billboard.payment.domain.PaymentStatus;
import com.cscreativ.billboard.payment.domain.Wallet;
import com.cscreativ.billboard.payment.domain.WalletRepository;
import com.cscreativ.billboard.payment.service.PaymentService;
import com.cscreativ.billboard.user.UserFacade;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.NoSuchElementException;
import java.util.UUID;

/** Direct and delegated payment checkout, plus wallet balance lookups for regisseurs. */
@RestController
@RequestMapping("/api/payments")
class PaymentController {

    private final PaymentService paymentService;
    private final PaymentRepository paymentRepository;
    private final WalletRepository walletRepository;
    private final UserFacade userFacade;

    PaymentController(
            PaymentService paymentService,
            PaymentRepository paymentRepository,
            WalletRepository walletRepository,
            UserFacade userFacade) {
        this.paymentService = paymentService;
        this.paymentRepository = paymentRepository;
        this.walletRepository = walletRepository;
        this.userFacade = userFacade;
    }

    @PostMapping("/{orderId}/pay")
    @PreAuthorize("hasAnyRole('ANNONCEUR', 'MEDIA_BUYER')")
    PaymentResponse pay(@PathVariable UUID orderId, @RequestBody PayRequest request) {
        return PaymentResponse.from(paymentService.pay(orderId, request.method()));
    }

    @GetMapping("/{orderId}")
    PaymentResponse getByOrder(@PathVariable UUID orderId) {
        return paymentRepository.findByOrderId(orderId)
                .map(PaymentResponse::from)
                .orElseThrow(() -> new NoSuchElementException("No payment for order " + orderId));
    }

    @GetMapping("/wallet/me")
    @PreAuthorize("hasRole('REGISSEUR')")
    WalletResponse myWallet(Authentication authentication) {
        UUID ownerId = userFacade.getByEmail(authentication.getName()).id();
        return walletRepository.findByOwnerId(ownerId)
                .map(WalletResponse::from)
                .orElse(new WalletResponse(ownerId, BigDecimal.ZERO, "XOF"));
    }

    record PayRequest(PaymentMethod method) {
    }

    record PaymentResponse(UUID id, UUID orderId, UUID payerId, BigDecimal amount, String currency,
                            PaymentMethod method, PaymentStatus status) {
        static PaymentResponse from(Payment p) {
            return new PaymentResponse(
                    p.getId(), p.getOrderId(), p.getPayerId(), p.getAmount(), p.getCurrency(), p.getMethod(), p.getStatus());
        }
    }

    record WalletResponse(UUID ownerId, BigDecimal balance, String currency) {
        static WalletResponse from(Wallet w) {
            return new WalletResponse(w.getOwnerId(), w.getBalance(), w.getCurrency());
        }
    }
}
