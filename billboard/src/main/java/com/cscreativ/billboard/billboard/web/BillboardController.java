package com.cscreativ.billboard.billboard.web;

import com.cscreativ.billboard.billboard.domain.Billboard;
import com.cscreativ.billboard.billboard.domain.BillboardRepository;
import com.cscreativ.billboard.billboard.domain.BillboardStatus;
import com.cscreativ.billboard.billboard.domain.BillboardType;
import com.cscreativ.billboard.billboard.domain.City;
import com.cscreativ.billboard.billboard.domain.CityRepository;
import com.cscreativ.billboard.user.UserFacade;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

/** Interactive map search and inventory management for regisseurs. */
@RestController
@RequestMapping("/api/billboards")
class BillboardController {

    private final BillboardRepository billboardRepository;
    private final CityRepository cityRepository;
    private final UserFacade userFacade;

    BillboardController(BillboardRepository billboardRepository, CityRepository cityRepository, UserFacade userFacade) {
        this.billboardRepository = billboardRepository;
        this.cityRepository = cityRepository;
        this.userFacade = userFacade;
    }

    @GetMapping
    List<BillboardResponse> search(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String country,
            @RequestParam(required = false) BillboardType type,
            @RequestParam(required = false) BillboardStatus status,
            @RequestParam(required = false) Double minLat,
            @RequestParam(required = false) Double maxLat,
            @RequestParam(required = false) Double minLng,
            @RequestParam(required = false) Double maxLng) {
        return billboardRepository.search(city, country, type, status, minLat, maxLat, minLng, maxLng)
                .stream()
                .map(BillboardResponse::from)
                .toList();
    }

    @GetMapping("/{id}")
    BillboardResponse getOne(@PathVariable UUID id) {
        return billboardRepository.findById(id)
                .map(BillboardResponse::from)
                .orElseThrow(() -> new NoSuchElementException("Billboard not found: " + id));
    }

    @GetMapping("/mine")
    @PreAuthorize("hasRole('REGISSEUR')")
    List<BillboardResponse> mine(Authentication authentication) {
        UUID ownerId = userFacade.getByEmail(authentication.getName()).id();
        return billboardRepository.findByOwnerId(ownerId).stream().map(BillboardResponse::from).toList();
    }

    @PostMapping
    @PreAuthorize("hasRole('REGISSEUR')")
    ResponseEntity<BillboardResponse> create(
            @Valid @RequestBody BillboardCreateRequest request, Authentication authentication) {
        UUID ownerId = userFacade.getByEmail(authentication.getName()).id();
        City city = resolveActiveCity(request.cityId());

        Billboard billboard = new Billboard(
                generateCodeReference(), ownerId, request.title(), request.description(), request.type(),
                request.format(), request.width(), request.height(), city.getId(), city.getName(), city.getCountryCode(),
                request.address(), request.latitude(), request.longitude(), resolveMonthlyPrice(request),
                request.currency(), request.imageUrl());
        applyOptionalFields(billboard, request);

        billboardRepository.save(billboard);
        return ResponseEntity.ok(BillboardResponse.from(billboard));
    }

    private String generateCodeReference() {
        return "BB-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    /** The daily price is the primary/required rate; the monthly rate defaults to 30 days of it when not given. */
    private BigDecimal resolveMonthlyPrice(BillboardCreateRequest request) {
        return request.monthlyPrice() != null ? request.monthlyPrice() : request.dailyPrice().multiply(BigDecimal.valueOf(30));
    }

    private void applyOptionalFields(Billboard billboard, BillboardCreateRequest request) {
        billboard.setFacesCount(request.facesCount() != null ? request.facesCount() : 1);
        billboard.setIlluminated(request.illuminated());
        billboard.setDigital(request.digital());
        billboard.setResolution(request.resolution());
        billboard.setSpotDurationSeconds(request.spotDurationSeconds());
        billboard.setEnvironmentType(request.environmentType());
        billboard.setOrientation(request.orientation());
        billboard.setDailyImpressions(request.dailyImpressions());
        billboard.setDailyPrice(request.dailyPrice());
        billboard.setMinBookingDays(request.minBookingDays() != null ? request.minBookingDays() : 30);
        billboard.setGalleryUrls(normalizeGalleryUrls(request.galleryUrls()));
    }

    private List<String> normalizeGalleryUrls(List<String> galleryUrls) {
        return galleryUrls == null ? new ArrayList<>() : new ArrayList<>(galleryUrls);
    }

    /** Resolves a city submitted from the CitySelect combobox, rejecting ids that don't exist or are inactive. */
    private City resolveActiveCity(UUID cityId) {
        City city = cityRepository.findById(cityId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown city: " + cityId));
        if (!city.isActive()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "City is not available: " + cityId);
        }
        return city;
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('REGISSEUR')")
    BillboardResponse update(
            @PathVariable UUID id, @Valid @RequestBody BillboardCreateRequest request, Authentication authentication) {
        Billboard billboard = requireOwnedBy(id, authentication);
        City city = resolveActiveCity(request.cityId());

        billboard.setTitle(request.title());
        billboard.setDescription(request.description());
        billboard.setType(request.type());
        billboard.setFormat(request.format());
        billboard.setWidth(request.width());
        billboard.setHeight(request.height());
        billboard.setCityId(city.getId());
        billboard.setCity(city.getName());
        billboard.setCountry(city.getCountryCode());
        billboard.setAddress(request.address());
        billboard.setLatitude(request.latitude());
        billboard.setLongitude(request.longitude());
        billboard.setMonthlyPrice(resolveMonthlyPrice(request));
        billboard.setCurrency(request.currency());
        billboard.setImageUrl(request.imageUrl());
        applyOptionalFields(billboard, request);

        billboardRepository.save(billboard);
        return BillboardResponse.from(billboard);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('REGISSEUR')")
    ResponseEntity<Void> delete(@PathVariable UUID id, Authentication authentication) {
        Billboard billboard = requireOwnedBy(id, authentication);
        billboardRepository.delete(billboard);
        return ResponseEntity.noContent().build();
    }

    private Billboard requireOwnedBy(UUID id, Authentication authentication) {
        UUID ownerId = userFacade.getByEmail(authentication.getName()).id();
        Billboard billboard = billboardRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Billboard not found: " + id));
        if (!billboard.getOwnerId().equals(ownerId)) {
            throw new IllegalStateException("You do not own this billboard");
        }
        return billboard;
    }
}
