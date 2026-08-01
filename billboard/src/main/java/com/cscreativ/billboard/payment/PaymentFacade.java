package com.cscreativ.billboard.payment;

import com.cscreativ.billboard.payment.domain.PaymentMethod;
import com.cscreativ.billboard.payment.domain.PaymentStatus;
import com.cscreativ.billboard.shared.domain.Money;

import java.util.Optional;
import java.util.UUID;

/**
 * Public API exposed by the payment module. Other modules must only depend
 * on this facade and the {@code domain}/{@code events} named interfaces,
 * never on {@code payment.service} or {@code payment.web}.
 */
public interface PaymentFacade {

    Optional<PaymentSummary> findByOrderId(UUID orderId);

    Money getWalletBalance(UUID ownerId);

    record PaymentSummary(UUID id, UUID orderId, UUID payerId, Money amount, PaymentMethod method, PaymentStatus status) {
    }
}
