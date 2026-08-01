package com.cscreativ.billboard.booking.events;

import java.time.Instant;
import java.util.UUID;

/** Published when an annonceur delegates the purchase of an order to a media buyer. */
public record OrderDelegatedEvent(UUID orderId, UUID annonceurId, UUID mediaBuyerId, Instant occurredAt) {

    public OrderDelegatedEvent(UUID orderId, UUID annonceurId, UUID mediaBuyerId) {
        this(orderId, annonceurId, mediaBuyerId, Instant.now());
    }
}
