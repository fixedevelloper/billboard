package com.cscreativ.billboard.booking;

public enum OrderStatus {
    /** Cart is being built, not yet checked out. */
    DRAFT,
    /** Checked out, awaiting payment from the payer (annonceur or media buyer). */
    PENDING_PAYMENT,
    /** Annonceur delegated the purchase to a media buyer; awaiting the media buyer's payment. */
    DELEGATED,
    /** Payment settled by the payment module. */
    PAID,
    /** Campaign confirmed and scheduled with the regisseurs. */
    CONFIRMED,
    CANCELLED
}
