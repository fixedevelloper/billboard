package com.cscreativ.billboard.booking.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, UUID> {

    List<Order> findByAnnonceurId(UUID annonceurId);

    List<Order> findByDelegatedToMediaBuyerId(UUID mediaBuyerId);

    List<Order> findByStatusInAndCheckedOutAtBefore(Collection<OrderStatus> statuses, Instant threshold);
}
