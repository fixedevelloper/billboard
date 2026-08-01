package com.cscreativ.billboard.billboard.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface BillboardRepository extends JpaRepository<Billboard, UUID> {

    List<Billboard> findByOwnerId(UUID ownerId);

    @Query("""
            select b from Billboard b
            where (:city is null or lower(b.city) = lower(:city))
              and (:country is null or lower(b.country) = lower(:country))
              and (:type is null or b.type = :type)
              and (:status is null or b.status = :status)
              and (:minLat is null or b.latitude >= :minLat)
              and (:maxLat is null or b.latitude <= :maxLat)
              and (:minLng is null or b.longitude >= :minLng)
              and (:maxLng is null or b.longitude <= :maxLng)
            """)
    List<Billboard> search(
            @Param("city") String city,
            @Param("country") String country,
            @Param("type") BillboardType type,
            @Param("status") BillboardStatus status,
            @Param("minLat") Double minLat,
            @Param("maxLat") Double maxLat,
            @Param("minLng") Double minLng,
            @Param("maxLng") Double maxLng);
}
