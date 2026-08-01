package com.cscreativ.billboard.booking.web;

import com.cscreativ.billboard.booking.domain.Order;
import com.cscreativ.billboard.booking.domain.OrderItem;
import com.cscreativ.billboard.booking.domain.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

record OrderResponse(
        UUID id,
        UUID annonceurId,
        UUID delegatedToMediaBuyerId,
        OrderStatus status,
        BigDecimal totalAmount,
        String currency,
        List<ItemResponse> items) {

    static OrderResponse from(Order order) {
        return new OrderResponse(
                order.getId(), order.getAnnonceurId(), order.getDelegatedToMediaBuyerId(), order.getStatus(),
                order.getTotalAmount(), order.getCurrency(),
                order.getItems().stream().map(ItemResponse::from).toList());
    }

    record ItemResponse(UUID billboardId, BigDecimal unitPrice, LocalDate startDate, LocalDate endDate) {
        static ItemResponse from(OrderItem item) {
            return new ItemResponse(item.getBillboardId(), item.getUnitPrice(), item.getStartDate(), item.getEndDate());
        }
    }
}
