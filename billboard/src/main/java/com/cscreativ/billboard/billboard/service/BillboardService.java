package com.cscreativ.billboard.billboard.service;

import com.cscreativ.billboard.billboard.BillboardFacade;
import com.cscreativ.billboard.billboard.domain.Billboard;
import com.cscreativ.billboard.billboard.domain.BillboardRepository;
import com.cscreativ.billboard.billboard.domain.BillboardStatus;
import com.cscreativ.billboard.billboard.events.BillboardStatusChangedEvent;
import com.cscreativ.billboard.shared.domain.GeoLocation;
import com.cscreativ.billboard.shared.domain.Money;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;

@Service
class BillboardService implements BillboardFacade {

    private final BillboardRepository billboardRepository;
    private final ApplicationEventPublisher eventPublisher;

    BillboardService(BillboardRepository billboardRepository, ApplicationEventPublisher eventPublisher) {
        this.billboardRepository = billboardRepository;
        this.eventPublisher = eventPublisher;
    }

    @Override
    public Optional<BillboardSummary> findById(UUID billboardId) {
        return billboardRepository.findById(billboardId).map(BillboardService::toSummary);
    }

    @Override
    public BillboardSummary getById(UUID billboardId) {
        return findById(billboardId)
                .orElseThrow(() -> new NoSuchElementException("Billboard not found: " + billboardId));
    }

    @Override
    public boolean isAvailable(UUID billboardId) {
        return billboardRepository.findById(billboardId)
                .map(b -> b.getStatus() == BillboardStatus.AVAILABLE)
                .orElse(false);
    }

    @Override
    public void reserve(UUID billboardId) {
        transitionTo(billboardId, BillboardStatus.AVAILABLE, BillboardStatus.RESERVED);
    }

    @Override
    public void release(UUID billboardId) {
        transitionTo(billboardId, BillboardStatus.RESERVED, BillboardStatus.AVAILABLE);
    }

    private void transitionTo(UUID billboardId, BillboardStatus expectedCurrent, BillboardStatus target) {
        Billboard billboard = billboardRepository.findById(billboardId)
                .orElseThrow(() -> new NoSuchElementException("Billboard not found: " + billboardId));

        if (billboard.getStatus() != expectedCurrent) {
            throw new IllegalStateException(
                    "Billboard %s is %s, expected %s".formatted(billboardId, billboard.getStatus(), expectedCurrent));
        }

        BillboardStatus previous = billboard.getStatus();
        billboard.setStatus(target);
        billboardRepository.save(billboard);
        eventPublisher.publishEvent(new BillboardStatusChangedEvent(billboardId, previous, target));
    }

    static BillboardSummary toSummary(Billboard b) {
        return new BillboardSummary(
                b.getId(),
                b.getOwnerId(),
                b.getTitle(),
                b.getType(),
                b.getCity(),
                b.getCountry(),
                new GeoLocation(b.getLatitude(), b.getLongitude()),
                new Money(b.getMonthlyPrice(), b.getCurrency()),
                b.getStatus());
    }
}
