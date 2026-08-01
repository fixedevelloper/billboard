package com.cscreativ.billboard.booking.events;

import java.time.Instant;
import java.util.UUID;

/** Published when an unpaid order is auto-cancelled after sitting in PENDING_PAYMENT/DELEGATED too long. */
public record OrderExpiredEvent(UUID orderId, UUID payerId, Instant occurredAt) {

    public OrderExpiredEvent(UUID orderId, UUID payerId) {
        this(orderId, payerId, Instant.now());
    }
}
