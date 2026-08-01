package com.cscreativ.billboard.payment.domain;

public enum PaymentStatus {
    PENDING,
    /** Funds captured and held in escrow until proof of performance is validated. */
    ESCROWED,
    /** Funds released to the regisseurs' wallets. */
    RELEASED,
    FAILED,
    REFUNDED
}
