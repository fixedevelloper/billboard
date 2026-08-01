package com.cscreativ.billboard.notification.service;

import com.cscreativ.billboard.booking.BookingFacade;
import com.cscreativ.billboard.notification.domain.NotificationType;
import com.cscreativ.billboard.payment.events.OrderPaidEvent;
import com.cscreativ.billboard.user.UserFacade;
import org.springframework.modulith.events.ApplicationModuleListener;
import org.springframework.stereotype.Component;

@Component
class PaymentNotificationListener {

    private final EmailService emailService;
    private final UserFacade userFacade;
    private final BookingFacade bookingFacade;

    PaymentNotificationListener(EmailService emailService, UserFacade userFacade, BookingFacade bookingFacade) {
        this.emailService = emailService;
        this.userFacade = userFacade;
        this.bookingFacade = bookingFacade;
    }

    @ApplicationModuleListener
    void onOrderPaid(OrderPaidEvent event) {
        var payerId = bookingFacade.resolvePayerId(event.orderId());
        var payer = userFacade.getById(payerId);
        emailService.send(
                payer.email(),
                NotificationType.ORDER_PAID,
                event.orderId(),
                "Paiement confirmé",
                EmailTemplates.orderPaid(payer.companyName(), event.orderId(), event.amount(), event.currency()));
    }
}
