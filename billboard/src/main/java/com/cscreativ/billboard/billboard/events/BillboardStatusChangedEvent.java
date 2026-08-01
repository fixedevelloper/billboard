package com.cscreativ.billboard.billboard.events;

import com.cscreativ.billboard.billboard.domain.BillboardStatus;

import java.time.Instant;
import java.util.UUID;

/** Published whenever a billboard transitions between AVAILABLE / RESERVED / MAINTENANCE / INACTIVE. */
public record BillboardStatusChangedEvent(
        UUID billboardId,
        BillboardStatus previousStatus,
        BillboardStatus newStatus,
        Instant occurredAt) {

    public BillboardStatusChangedEvent(UUID billboardId, BillboardStatus previousStatus, BillboardStatus newStatus) {
        this(billboardId, previousStatus, newStatus, Instant.now());
    }
}
