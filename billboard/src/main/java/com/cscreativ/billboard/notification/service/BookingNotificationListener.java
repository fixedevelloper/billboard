package com.cscreativ.billboard.notification.service;

import com.cscreativ.billboard.booking.events.OrderCreatedEvent;
import com.cscreativ.billboard.booking.events.OrderDelegatedEvent;
import com.cscreativ.billboard.booking.events.OrderExpiredEvent;
import com.cscreativ.billboard.notification.domain.NotificationType;
import com.cscreativ.billboard.user.UserFacade;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.modulith.events.ApplicationModuleListener;
import org.springframework.stereotype.Component;

@Component
class BookingNotificationListener {

    private final EmailService emailService;
    private final UserFacade userFacade;
    private final long orderExpirationMinutes;

    BookingNotificationListener(
            EmailService emailService,
            UserFacade userFacade,
            @Value("${app.booking.order-expiration-minutes:60}") long orderExpirationMinutes) {
        this.emailService = emailService;
        this.userFacade = userFacade;
        this.orderExpirationMinutes = orderExpirationMinutes;
    }

    @ApplicationModuleListener
    void onOrderCreated(OrderCreatedEvent event) {
        var payer = userFacade.getById(event.payerId());
        emailService.send(
                payer.email(),
                NotificationType.ORDER_CREATED,
                event.orderId(),
                "Votre commande a été créée",
                EmailTemplates.orderCreated(payer.companyName(), event.orderId(), event.totalAmount(), event.currency()));
    }

    @ApplicationModuleListener
    void onOrderDelegated(OrderDelegatedEvent event) {
        var mediaBuyer = userFacade.getById(event.mediaBuyerId());
        var annonceur = userFacade.getById(event.annonceurId());
        emailService.send(
                mediaBuyer.email(),
                NotificationType.ORDER_DELEGATED,
                event.orderId(),
                "Une commande vous a été déléguée",
                EmailTemplates.orderDelegated(mediaBuyer.companyName(), annonceur.companyName(), event.orderId()));
    }

    @ApplicationModuleListener
    void onOrderExpired(OrderExpiredEvent event) {
        var payer = userFacade.getById(event.payerId());
        emailService.send(
                payer.email(),
                NotificationType.ORDER_EXPIRED,
                event.orderId(),
                "Votre commande a expiré",
                EmailTemplates.orderExpired(payer.companyName(), event.orderId(), orderExpirationMinutes));
    }
}
