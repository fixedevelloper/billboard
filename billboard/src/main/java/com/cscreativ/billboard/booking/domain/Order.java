package com.cscreativ.billboard.booking.domain;

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
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /** Id of the annonceur (user module) who composed the campaign. */
    @Column(nullable = false)
    private UUID annonceurId;

    /** Id of the media buyer (user module) the purchase was delegated to, if any. */
    private UUID delegatedToMediaBuyerId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status = OrderStatus.DRAFT;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @Column(nullable = false, length = 3)
    private String currency;

    // ✅ Correction : Suppression de @ElementCollection et ajout de fetch = FetchType.EAGER
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<OrderItem> items = new ArrayList<>();

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    /** When the order left DRAFT for PENDING_PAYMENT; the expiration window is measured from here. */
    private Instant checkedOutAt;

    public Order(UUID annonceurId, String currency) {
        this.annonceurId = annonceurId;
        this.currency = currency;
        this.status = OrderStatus.DRAFT;
        this.totalAmount = BigDecimal.ZERO;
    }

    public void addItem(OrderItem item) {
        item.setOrder(this);
        items.add(item);
        totalAmount = totalAmount.add(item.getUnitPrice());
    }

    public UUID payerId() {
        return delegatedToMediaBuyerId != null ? delegatedToMediaBuyerId : annonceurId;
    }
}