package com.cscreativ.billboard.proofofperformance.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

/** A geolocated, timestamped photo evidencing that a campaign was physically deployed. */
@Entity
@Table(name = "proofs_of_performance")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProofOfPerformance {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID orderId;

    @Column(nullable = false)
    private UUID billboardId;

    /** Id of the field agent / regisseur (user module) who captured the photo. */
    @Column(nullable = false)
    private UUID capturedBy;

    @Column(nullable = false)
    private String photoUrl;

    @Column(nullable = false)
    private double latitude;

    @Column(nullable = false)
    private double longitude;

    @Column(nullable = false)
    private Instant capturedAt;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public ProofOfPerformance(
            UUID orderId, UUID billboardId, UUID capturedBy, String photoUrl,
            double latitude, double longitude, Instant capturedAt) {
        this.orderId = orderId;
        this.billboardId = billboardId;
        this.capturedBy = capturedBy;
        this.photoUrl = photoUrl;
        this.latitude = latitude;
        this.longitude = longitude;
        this.capturedAt = capturedAt;
    }
}
