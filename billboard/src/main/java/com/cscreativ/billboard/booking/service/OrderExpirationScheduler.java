package com.cscreativ.billboard.booking.service;

import com.cscreativ.billboard.billboard.BillboardFacade;
import com.cscreativ.billboard.booking.domain.Order;
import com.cscreativ.billboard.booking.domain.OrderRepository;
import com.cscreativ.billboard.booking.domain.OrderStatus;
import com.cscreativ.billboard.booking.events.OrderExpiredEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

/**
 * Auto-cancels orders left unpaid (PENDING_PAYMENT or DELEGATED) past
 * {@code app.booking.order-expiration-minutes} and releases their reserved billboards.
 */
@Component
class OrderExpirationScheduler {

    private static final Logger log = LoggerFactory.getLogger(OrderExpirationScheduler.class);
    private static final List<OrderStatus> EXPIRABLE_STATUSES = List.of(OrderStatus.PENDING_PAYMENT, OrderStatus.DELEGATED);

    private final OrderRepository orderRepository;
    private final BillboardFacade billboardFacade;
    private final ApplicationEventPublisher eventPublisher;
    private final long expirationMinutes;

    OrderExpirationScheduler(
            OrderRepository orderRepository,
            BillboardFacade billboardFacade,
            ApplicationEventPublisher eventPublisher,
            @Value("${app.booking.order-expiration-minutes:60}") long expirationMinutes) {
        this.orderRepository = orderRepository;
        this.billboardFacade = billboardFacade;
        this.eventPublisher = eventPublisher;
        this.expirationMinutes = expirationMinutes;
    }

    @Scheduled(fixedDelayString = "${app.booking.expiration-check-interval-ms:60000}")
    @Transactional
    void expireStaleOrders() {
        Instant threshold = Instant.now().minus(expirationMinutes, ChronoUnit.MINUTES);
        List<Order> staleOrders = orderRepository.findByStatusInAndCheckedOutAtBefore(EXPIRABLE_STATUSES, threshold);

        for (Order order : staleOrders) {
            order.getItems().forEach(item -> billboardFacade.release(item.getBillboardId()));
            order.setStatus(OrderStatus.EXPIRED);
            orderRepository.save(order);
            eventPublisher.publishEvent(new OrderExpiredEvent(order.getId(), order.payerId()));
            log.info("Order {} expired after {} minutes unpaid", order.getId(), expirationMinutes);
        }
    }
}
