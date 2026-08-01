package com.cscreativ.billboard.proofofperformance;

import com.cscreativ.billboard.shared.domain.GeoLocation;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Public API exposed by the proof-of-performance module. Other modules must
 * never depend on {@code proofofperformance.internal} types.
 */
public interface POPFacade {

    List<ProofSummary> findByOrderId(UUID orderId);

    List<ProofSummary> findByBillboardId(UUID billboardId);

    record ProofSummary(
            UUID id, UUID orderId, UUID billboardId, UUID capturedBy,
            String photoUrl, GeoLocation location, Instant capturedAt) {
    }
}
