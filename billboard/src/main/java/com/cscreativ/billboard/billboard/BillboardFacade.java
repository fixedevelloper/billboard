package com.cscreativ.billboard.billboard;

import com.cscreativ.billboard.billboard.domain.BillboardStatus;
import com.cscreativ.billboard.billboard.domain.BillboardType;
import com.cscreativ.billboard.shared.domain.GeoLocation;
import com.cscreativ.billboard.shared.domain.Money;

import java.util.Optional;
import java.util.UUID;

/**
 * Public API exposed by the billboard module. The booking and payment modules
 * use this facade to check availability, pricing and to reserve a panel;
 * they must only depend on this facade and the {@code domain}/{@code events}
 * named interfaces, never on {@code billboard.service} or {@code billboard.web}.
 */
public interface BillboardFacade {

    Optional<BillboardSummary> findById(UUID billboardId);

    BillboardSummary getById(UUID billboardId);

    boolean isAvailable(UUID billboardId);

    /** Transitions the billboard to RESERVED. Throws if it isn't currently AVAILABLE. */
    void reserve(UUID billboardId);

    /** Releases a previously reserved billboard back to AVAILABLE. */
    void release(UUID billboardId);

    record BillboardSummary(
            UUID id,
            UUID ownerId,
            String title,
            BillboardType type,
            String city,
            String country,
            GeoLocation location,
            Money monthlyPrice,
            BillboardStatus status) {
    }
}
