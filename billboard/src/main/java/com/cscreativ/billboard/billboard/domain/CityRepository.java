package com.cscreativ.billboard.billboard.domain;

import org.springframework.data.domain.Limit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CityRepository extends JpaRepository<City, java.util.UUID> {

    List<City> findByActiveTrueAndNameContainingIgnoreCaseOrderByNameAsc(String query, Limit limit);

    List<City> findByActiveTrueOrderByNameAsc(Limit limit);
}
