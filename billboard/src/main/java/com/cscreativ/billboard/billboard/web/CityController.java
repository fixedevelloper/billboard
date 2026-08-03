package com.cscreativ.billboard.billboard.web;

import com.cscreativ.billboard.billboard.domain.City;
import com.cscreativ.billboard.billboard.domain.CityRepository;
import org.springframework.data.domain.Limit;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

/** Searchable reference list of cities, used to fill in a billboard's location. */
@RestController
@RequestMapping("/api/cities")
class CityController {

    private static final int MAX_RESULTS = 20;

    private final CityRepository cityRepository;

    CityController(CityRepository cityRepository) {
        this.cityRepository = cityRepository;
    }

    @GetMapping
    List<CityResponse> search(@RequestParam(required = false) String query) {
        List<City> cities = (query == null || query.isBlank())
                ? cityRepository.findByActiveTrueOrderByNameAsc(Limit.of(MAX_RESULTS))
                : cityRepository.findByActiveTrueAndNameContainingIgnoreCaseOrderByNameAsc(query, Limit.of(MAX_RESULTS));
        return cities.stream().map(CityResponse::from).toList();
    }

    record CityResponse(UUID id, String name, String countryCode, double latitude, double longitude) {
        static CityResponse from(City city) {
            return new CityResponse(city.getId(), city.getName(), city.getCountryCode(), city.getLatitude(), city.getLongitude());
        }
    }
}
