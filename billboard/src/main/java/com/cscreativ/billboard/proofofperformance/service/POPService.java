package com.cscreativ.billboard.proofofperformance.service;

import com.cscreativ.billboard.proofofperformance.POPFacade;
import com.cscreativ.billboard.proofofperformance.domain.ProofOfPerformance;
import com.cscreativ.billboard.proofofperformance.domain.ProofOfPerformanceRepository;
import com.cscreativ.billboard.shared.domain.GeoLocation;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class POPService implements POPFacade {

    private final ProofOfPerformanceRepository repository;

    POPService(ProofOfPerformanceRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<ProofSummary> findByOrderId(UUID orderId) {
        return repository.findByOrderId(orderId).stream().map(POPService::toSummary).toList();
    }

    @Override
    public List<ProofSummary> findByBillboardId(UUID billboardId) {
        return repository.findByBillboardId(billboardId).stream().map(POPService::toSummary).toList();
    }

    public ProofOfPerformance capture(UUID orderId, UUID billboardId, UUID capturedBy, String photoUrl, double lat, double lng) {
        ProofOfPerformance proof = new ProofOfPerformance(
                orderId, billboardId, capturedBy, photoUrl, lat, lng, java.time.Instant.now());
        return repository.save(proof);
    }

    private static ProofSummary toSummary(ProofOfPerformance p) {
        return new ProofSummary(
                p.getId(), p.getOrderId(), p.getBillboardId(), p.getCapturedBy(),
                p.getPhotoUrl(), new GeoLocation(p.getLatitude(), p.getLongitude()), p.getCapturedAt());
    }
}
