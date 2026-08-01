package com.cscreativ.billboard.booking.service;

import com.cscreativ.billboard.billboard.BillboardFacade;
import com.cscreativ.billboard.booking.BookingFacade;
import com.cscreativ.billboard.booking.domain.Order;
import com.cscreativ.billboard.booking.domain.OrderItem;
import com.cscreativ.billboard.booking.domain.OrderRepository;
import com.cscreativ.billboard.booking.domain.OrderStatus;
import com.cscreativ.billboard.booking.events.OrderCreatedEvent;
import com.cscreativ.billboard.booking.events.OrderDelegatedEvent;
import com.cscreativ.billboard.shared.domain.Money;
import com.cscreativ.billboard.user.UserFacade;
import com.cscreativ.billboard.user.UserFacade.UserSummary;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

@Service
@Transactional
public class BookingService implements BookingFacade {

    private final OrderRepository orderRepository;
    private final BillboardFacade billboardFacade;
    private final UserFacade userFacade;
    private final ApplicationEventPublisher eventPublisher;

    BookingService(
            OrderRepository orderRepository,
            BillboardFacade billboardFacade,
            UserFacade userFacade,
            ApplicationEventPublisher eventPublisher) {
        this.orderRepository = orderRepository;
        this.billboardFacade = billboardFacade;
        this.userFacade = userFacade;
        this.eventPublisher = eventPublisher;
    }

    @Override
    public OrderSummary getById(UUID orderId) {
        return toSummary(requireOrder(orderId));
    }

    @Override
    public UUID resolvePayerId(UUID orderId) {
        return requireOrder(orderId).payerId();
    }

    @Override
    public void markOrderPaid(UUID orderId) {
        markPaid(orderId);
    }

    /** Reserves each billboard and creates a DRAFT order composed of the given cart items. */
    public Order createOrder(UUID annonceurId, String currency, List<CartLine> lines) {
        Order order = new Order(annonceurId, currency);

        for (CartLine line : lines) {
            var billboard = billboardFacade.getById(line.billboardId());
            if (!billboardFacade.isAvailable(line.billboardId())) {
                throw new IllegalStateException("Billboard %s is not available".formatted(line.billboardId()));
            }
            billboardFacade.reserve(line.billboardId());
            order.addItem(new OrderItem(line.billboardId(), billboard.monthlyPrice().amount(), line.startDate(), line.endDate()));
        }

        return orderRepository.save(order);
    }

    /** Checks the order out: moves it to PENDING_PAYMENT and notifies the payment module. */
    public Order checkout(UUID orderId, UUID requesterId) {
        Order order = requireOwnedBy(orderId, requesterId);
        if (order.getStatus() != OrderStatus.DRAFT) {
            throw new IllegalStateException("Order %s is not in DRAFT state".formatted(orderId));
        }

        order.setStatus(OrderStatus.PENDING_PAYMENT);
        order.setCheckedOutAt(java.time.Instant.now());
        orderRepository.save(order);

        eventPublisher.publishEvent(
                new OrderCreatedEvent(order.getId(), order.payerId(), order.getTotalAmount(), order.getCurrency()));

        return order;
    }

    /** The annonceur delegates payment of this order to a media buyer. */
    public Order delegate(UUID orderId, UUID annonceurId, UUID mediaBuyerId) {
        Order order = requireOwnedBy(orderId, annonceurId);

        UserSummary mediaBuyer = userFacade.getById(mediaBuyerId);
        if (mediaBuyer.role() != com.cscreativ.billboard.shared.domain.Role.MEDIA_BUYER) {
            throw new IllegalArgumentException("User %s is not a media buyer".formatted(mediaBuyerId));
        }

        order.setDelegatedToMediaBuyerId(mediaBuyerId);
        order.setStatus(OrderStatus.DELEGATED);
        orderRepository.save(order);

        eventPublisher.publishEvent(new OrderDelegatedEvent(orderId, annonceurId, mediaBuyerId));
        return order;
    }

    public void cancel(UUID orderId, UUID requesterId) {
        Order order = requireOwnedBy(orderId, requesterId);
        order.getItems().forEach(item -> billboardFacade.release(item.getBillboardId()));
        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
    }

    void markPaid(UUID orderId) {
        Order order = requireOrder(orderId);
        order.setStatus(OrderStatus.PAID);
        orderRepository.save(order);
    }

    public List<Order> findByAnnonceur(UUID annonceurId) {
        return orderRepository.findByAnnonceurId(annonceurId);
    }

    public List<Order> findDelegatedTo(UUID mediaBuyerId) {
        return orderRepository.findByDelegatedToMediaBuyerId(mediaBuyerId);
    }

    private Order requireOrder(UUID orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new NoSuchElementException("Order not found: " + orderId));
    }

    private Order requireOwnedBy(UUID orderId, UUID annonceurId) {
        Order order = requireOrder(orderId);
        if (!order.getAnnonceurId().equals(annonceurId)) {
            throw new IllegalStateException("Order %s does not belong to %s".formatted(orderId, annonceurId));
        }
        return order;
    }

    static OrderSummary toSummary(Order order) {
        return new OrderSummary(
                order.getId(),
                order.getAnnonceurId(),
                order.getDelegatedToMediaBuyerId(),
                order.getStatus(),
                new Money(order.getTotalAmount(), order.getCurrency()),
                order.getItems().stream()
                        .map(i -> new OrderItemSummary(
                                i.getBillboardId(), new Money(i.getUnitPrice(), order.getCurrency()),
                                i.getStartDate(), i.getEndDate()))
                        .toList());
    }

    public record CartLine(UUID billboardId, java.time.LocalDate startDate, java.time.LocalDate endDate) {
    }
}
