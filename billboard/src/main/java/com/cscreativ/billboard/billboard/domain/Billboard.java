package com.cscreativ.billboard.billboard.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(
        name = "billboards",
        indexes = {
                @Index(name = "idx_billboard_city_status", columnList = "city, status"),
                @Index(name = "idx_billboard_owner", columnList = "ownerId"),
                @Index(name = "idx_billboard_code", columnList = "codeReference", unique = true)
        }
)
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Billboard {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /** Référence interne ou matricule unique (ex: DLA-AKWA-001) */
    @Column(nullable = false, unique = true, length = 50)
    private String codeReference;

    /** ID du régisseur (propriétaire de l'équipement) */
    @Column(nullable = false)
    private UUID ownerId;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private BillboardType type;

    @Column(nullable = false, length = 50)
    private String format; // Ex: "4x3", "6x3", "8x3", "Écran LED 55 pouces"

    // --- CARACTÉRISTIQUES PHYSIQUES & TECHNIQUES ---

    /** Largeur en mètres */
    @Column(precision = 5, scale = 2)
    private BigDecimal width;

    /** Hauteur en mètres */
    @Column(precision = 5, scale = 2)
    private BigDecimal height;

    /** Nombre de faces d'affichage (default: 1) */
    @Column(nullable = false)
    private int facesCount = 1;

    /** Éclairé la nuit (spot, rétroéclairé) */
    @Column(nullable = false)
    private boolean isIlluminated = false;

    /** Panneau numérique / dynamique (DOOH) */
    @Column(nullable = false)
    private boolean isDigital = false;

    /** Résolution pour les écrans digitaux (ex: "1920x1080") */
    private String resolution;

    /** Durée d'un spot publicitaire en secondes (DOOH) */
    private Integer spotDurationSeconds;

    // --- LOCALISATION & TRAFIC ---

    /** Ville de référence (voir CityRepository) ; nullable pour les panneaux créés avant cette fonctionnalité */
    @Column
    private UUID cityId;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String country;

    private String address;

    /** Zone / Type d'environnement (ex: "Aéroport", "Centre Commercial", "Axe Majeur") */
    private String environmentType;

    /** Orientation du panneau par rapport à la voie */
    private String orientation;

    @Column(nullable = false)
    private double latitude;

    @Column(nullable = false)
    private double longitude;

    /** Estimation du passage quotidien (piétons + véhicules) */
    private Long dailyImpressions;

    // --- TARIFICATION & CONDITIONS DE LOCATION ---

    @Column(precision = 12, scale = 2)
    private BigDecimal dailyPrice;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal monthlyPrice;

    @Column(nullable = false, length = 3)
    private String currency = "XAF";

    /** Durée minimale de réservation en jours (default: 30) */
    @Column(nullable = false)
    private int minBookingDays = 30;

    // --- STATUT & MÉDIAS ---

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private BillboardStatus status = BillboardStatus.AVAILABLE;

    /** Image principale / d'illustration */
    private String imageUrl;

    /** Galerie de photos sous différents angles / vues jour & nuit */
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "billboard_images", joinColumns = @JoinColumn(name = "billboard_id"))
    @Column(name = "image_url")
    private List<String> galleryUrls = new ArrayList<>();

    /** Indique si l'annonce est validée par l'administrateur */
    @Column(nullable = false)
    private boolean isVerified = false;

    // --- AUDIT & TIMESTAMPS ---

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(nullable = false)
    private Instant updatedAt = Instant.now();

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }

    // --- CONSTRUCTEUR ---

    public Billboard(
            String codeReference, UUID ownerId, String title, String description, BillboardType type,
            String format, BigDecimal width, BigDecimal height, UUID cityId, String city, String country,
            String address, double latitude, double longitude, BigDecimal monthlyPrice,
            String currency, String imageUrl) {
        this.codeReference = codeReference;
        this.ownerId = ownerId;
        this.title = title;
        this.description = description;
        this.type = type;
        this.format = format;
        this.width = width;
        this.height = height;
        this.cityId = cityId;
        this.city = city;
        this.country = country;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
        this.monthlyPrice = monthlyPrice;
        this.currency = currency;
        this.imageUrl = imageUrl;
        this.status = BillboardStatus.AVAILABLE;
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }
}