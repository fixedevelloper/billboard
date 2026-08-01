package com.cscreativ.billboard.billboard.web;

import com.cscreativ.billboard.billboard.domain.BillboardType;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

record BillboardCreateRequest(
        @NotBlank String title,
        String description,
        @NotNull BillboardType type,
        @NotBlank String format,
        @NotBlank String city,
        @NotBlank String country,
        String address,
        @DecimalMin("-90") @DecimalMax("90") double latitude,
        @DecimalMin("-180") @DecimalMax("180") double longitude,
        @NotNull @DecimalMin(value = "0", inclusive = true) BigDecimal monthlyPrice,
        @NotBlank @Size(min = 3, max = 3) String currency,
        String imageUrl) {
}
