package com.cscreativ.billboard.billboard.web;

import com.cscreativ.billboard.billboard.domain.Billboard;
import com.cscreativ.billboard.billboard.domain.BillboardStatus;
import com.cscreativ.billboard.billboard.domain.BillboardType;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

record BillboardResponse(
        UUID id,
        UUID ownerId,
        String codeReference,
        String title,
        String description,
        BillboardType type,
        String format,
        BigDecimal width,
        BigDecimal height,
        int facesCount,
        boolean illuminated,
        boolean digital,
        String resolution,
        Integer spotDurationSeconds,
        UUID cityId,
        String city,
        String country,
        String address,
        String environmentType,
        String orientation,
        double latitude,
        double longitude,
        Long dailyImpressions,
        BigDecimal dailyPrice,
        BigDecimal monthlyPrice,
        String currency,
        int minBookingDays,
        BillboardStatus status,
        String imageUrl,
        List<String> galleryUrls) {

    static BillboardResponse from(Billboard b) {
        return new BillboardResponse(
                b.getId(), b.getOwnerId(), b.getCodeReference(), b.getTitle(), b.getDescription(), b.getType(),
                b.getFormat(), b.getWidth(), b.getHeight(), b.getFacesCount(), b.isIlluminated(), b.isDigital(),
                b.getResolution(), b.getSpotDurationSeconds(), b.getCityId(), b.getCity(), b.getCountry(),
                b.getAddress(), b.getEnvironmentType(), b.getOrientation(), b.getLatitude(), b.getLongitude(),
                b.getDailyImpressions(), b.getDailyPrice(), b.getMonthlyPrice(), b.getCurrency(), b.getMinBookingDays(),
                b.getStatus(), b.getImageUrl(), b.getGalleryUrls());
    }
}
