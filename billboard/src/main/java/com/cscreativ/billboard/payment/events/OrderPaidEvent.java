package com.cscreativ.billboard.payment.events;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/** Published once payment for an order has been captured and escrowed. */
public record OrderPaidEvent(UUID orderId, UUID paymentId, BigDecimal amount, String currency, Instant occurredAt) {

    public OrderPaidEvent(UUID orderId, UUID paymentId, BigDecimal amount, String currency) {
        this(orderId, paymentId, amount, currency, Instant.now());
    }
}
