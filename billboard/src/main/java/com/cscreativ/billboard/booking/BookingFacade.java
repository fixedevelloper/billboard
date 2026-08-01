package com.cscreativ.billboard.booking;

import com.cscreativ.billboard.booking.domain.OrderStatus;
import com.cscreativ.billboard.shared.domain.Money;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * Public API exposed by the booking module. The payment module uses this
 * facade to read order details; it must only depend on this facade and the
 * {@code domain}/{@code events} named interfaces, never on {@code booking.service}
 * or {@code booking.web}.
 */
public interface BookingFacade {

    OrderSummary getById(UUID orderId);

    /** The user who must pay: the annonceur for a direct purchase, or the delegated media buyer. */
    UUID resolvePayerId(UUID orderId);

    /** Called by the payment module once funds have been captured and escrowed for this order. */
    void markOrderPaid(UUID orderId);

    record OrderSummary(
            UUID id,
            UUID annonceurId,
            UUID delegatedToMediaBuyerId,
            OrderStatus status,
            Money totalAmount,
            List<OrderItemSummary> items) {
    }

    record OrderItemSummary(UUID billboardId, Money unitPrice, LocalDate startDate, LocalDate endDate) {
    }
}
