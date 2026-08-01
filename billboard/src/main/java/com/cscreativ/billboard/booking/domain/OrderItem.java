package com.cscreativ.billboard.booking.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    /** Id of the reserved billboard (billboard module), referenced by id only. */
    @Column(nullable = false)
    private UUID billboardId;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal unitPrice;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    public OrderItem(UUID billboardId, BigDecimal unitPrice, LocalDate startDate, LocalDate endDate) {
        this.billboardId = billboardId;
        this.unitPrice = unitPrice;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}
