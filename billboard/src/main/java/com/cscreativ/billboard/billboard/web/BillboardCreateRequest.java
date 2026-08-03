package com.cscreativ.billboard.billboard.web;

import com.cscreativ.billboard.billboard.domain.BillboardType;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

record BillboardCreateRequest(
        @NotBlank String title,
        String description,
        @NotNull BillboardType type,
        @NotBlank String format,
        @DecimalMin(value = "0", inclusive = false) BigDecimal width,
        @DecimalMin(value = "0", inclusive = false) BigDecimal height,
        @Min(1) Integer facesCount,
        boolean illuminated,
        boolean digital,
        String resolution,
        @Min(1) Integer spotDurationSeconds,
        @NotNull UUID cityId,
        String address,
        String environmentType,
        String orientation,
        @DecimalMin("-90") @DecimalMax("90") double latitude,
        @DecimalMin("-180") @DecimalMax("180") double longitude,
        @Min(0) Long dailyImpressions,
        @NotNull @DecimalMin(value = "0", inclusive = true) BigDecimal dailyPrice,
        @DecimalMin(value = "0", inclusive = true) BigDecimal monthlyPrice,
        @NotBlank @Size(min = 3, max = 3) String currency,
        @Min(1) Integer minBookingDays,
        String imageUrl,
        List<String> galleryUrls) {
}
