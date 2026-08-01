package com.cscreativ.billboard.billboard.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "billboards")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Billboard {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /** Id of the owning regisseur (user module), referenced by id only - no cross-module JPA relation. */
    @Column(nullable = false)
    private UUID ownerId;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BillboardType type;

    @Column(nullable = false)
    private String format;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String country;

    private String address;

    @Column(nullable = false)
    private double latitude;

    @Column(nullable = false)
    private double longitude;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal monthlyPrice;

    @Column(nullable = false, length = 3)
    private String currency;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BillboardStatus status = BillboardStatus.AVAILABLE;

    private String imageUrl;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public Billboard(
            UUID ownerId, String title, String description, BillboardType type, String format,
            String city, String country, String address, double latitude, double longitude,
            BigDecimal monthlyPrice, String currency, String imageUrl) {
        this.ownerId = ownerId;
        this.title = title;
        this.description = description;
        this.type = type;
        this.format = format;
        this.city = city;
        this.country = country;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
        this.monthlyPrice = monthlyPrice;
        this.currency = currency;
        this.imageUrl = imageUrl;
        this.status = BillboardStatus.AVAILABLE;
    }
}
