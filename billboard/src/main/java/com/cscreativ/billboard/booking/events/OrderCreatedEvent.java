package com.cscreativ.billboard.booking.events;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/** Published when an order is checked out and awaits payment from {@code payerId}. */
public record OrderCreatedEvent(UUID orderId, UUID payerId, BigDecimal totalAmount, String currency, Instant occurredAt) {

    public OrderCreatedEvent(UUID orderId, UUID payerId, BigDecimal totalAmount, String currency) {
        this(orderId, payerId, totalAmount, currency, Instant.now());
    }
}
