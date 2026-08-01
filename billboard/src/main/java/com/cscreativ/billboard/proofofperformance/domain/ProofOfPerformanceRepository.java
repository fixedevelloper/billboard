package com.cscreativ.billboard.proofofperformance.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ProofOfPerformanceRepository extends JpaRepository<ProofOfPerformance, UUID> {

    List<ProofOfPerformance> findByOrderId(UUID orderId);

    List<ProofOfPerformance> findByBillboardId(UUID billboardId);
}
