package com.cscreativ.billboard.billboard.web;

import com.cscreativ.billboard.billboard.domain.Billboard;
import com.cscreativ.billboard.billboard.domain.BillboardStatus;
import com.cscreativ.billboard.billboard.domain.BillboardType;

import java.math.BigDecimal;
import java.util.UUID;

record BillboardResponse(
        UUID id,
        UUID ownerId,
        String title,
        String description,
        BillboardType type,
        String format,
        String city,
        String country,
        String address,
        double latitude,
        double longitude,
        BigDecimal monthlyPrice,
        String currency,
        BillboardStatus status,
        String imageUrl) {

    static BillboardResponse from(Billboard b) {
        return new BillboardResponse(
                b.getId(), b.getOwnerId(), b.getTitle(), b.getDescription(), b.getType(), b.getFormat(),
                b.getCity(), b.getCountry(), b.getAddress(), b.getLatitude(), b.getLongitude(),
                b.getMonthlyPrice(), b.getCurrency(), b.getStatus(), b.getImageUrl());
    }
}
