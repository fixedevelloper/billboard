package com.cscreativ.billboard.billboard.web;

import com.cscreativ.billboard.billboard.domain.Billboard;
import com.cscreativ.billboard.billboard.domain.BillboardRepository;
import com.cscreativ.billboard.billboard.domain.BillboardStatus;
import com.cscreativ.billboard.billboard.domain.BillboardType;
import com.cscreativ.billboard.user.UserFacade;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

/** Interactive map search and inventory management for regisseurs. */
@RestController
@RequestMapping("/api/billboards")
class BillboardController {

    private final BillboardRepository billboardRepository;
    private final UserFacade userFacade;

    BillboardController(BillboardRepository billboardRepository, UserFacade userFacade) {
        this.billboardRepository = billboardRepository;
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

        Billboard billboard = new Billboard(
                ownerId, request.title(), request.description(), request.type(), request.format(),
                request.city(), request.country(), request.address(), request.latitude(), request.longitude(),
                request.monthlyPrice(), request.currency(), request.imageUrl());

        billboardRepository.save(billboard);
        return ResponseEntity.ok(BillboardResponse.from(billboard));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('REGISSEUR')")
    BillboardResponse update(
            @PathVariable UUID id, @Valid @RequestBody BillboardCreateRequest request, Authentication authentication) {
        Billboard billboard = requireOwnedBy(id, authentication);

        billboard.setTitle(request.title());
        billboard.setDescription(request.description());
        billboard.setType(request.type());
        billboard.setFormat(request.format());
        billboard.setCity(request.city());
        billboard.setCountry(request.country());
        billboard.setAddress(request.address());
        billboard.setLatitude(request.latitude());
        billboard.setLongitude(request.longitude());
        billboard.setMonthlyPrice(request.monthlyPrice());
        billboard.setCurrency(request.currency());
        billboard.setImageUrl(request.imageUrl());

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
