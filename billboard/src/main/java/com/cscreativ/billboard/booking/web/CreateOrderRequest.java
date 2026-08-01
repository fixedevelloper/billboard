package com.cscreativ.billboard.booking.web;

import jakarta.validation.Valid;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

record CreateOrderRequest(
        @NotNull @jakarta.validation.constraints.Pattern(regexp = "[A-Z]{3}") String currency,
        @NotEmpty @Valid List<CartLineRequest> items) {

    record CartLineRequest(
            @NotNull UUID billboardId,
            @NotNull @FutureOrPresent LocalDate startDate,
            @NotNull @FutureOrPresent LocalDate endDate) {
    }
}
