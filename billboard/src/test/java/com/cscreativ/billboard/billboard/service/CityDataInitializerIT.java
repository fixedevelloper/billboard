package com.cscreativ.billboard.billboard.service;

import com.cscreativ.billboard.billboard.domain.City;
import com.cscreativ.billboard.billboard.domain.CityRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.DefaultApplicationArguments;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Limit;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Confirms the searchable city list is seeded once at startup and that the
 * case-insensitive partial-name search used by the billboard creation form
 * (see CityController) actually finds a known seeded city.
 */
@SpringBootTest
class CityDataInitializerIT {

    @Autowired
    private CityDataInitializer cityDataInitializer;

    @Autowired
    private CityRepository cityRepository;

    @Test
    void seedsCitiesOnceAndTheyAreSearchable() {
        long seededCount = cityRepository.count();
        assertThat(seededCount).isPositive();

        var matches = cityRepository.findByActiveTrueAndNameContainingIgnoreCaseOrderByNameAsc("lom", Limit.of(10));
        assertThat(matches).extracting(City::getName).contains("Lomé");
        assertThat(matches).allMatch(City::isActive);

        cityDataInitializer.run(new DefaultApplicationArguments());

        assertThat(cityRepository.count()).isEqualTo(seededCount);
    }
}
