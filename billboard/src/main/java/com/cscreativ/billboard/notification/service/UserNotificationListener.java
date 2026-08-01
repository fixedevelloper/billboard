package com.cscreativ.billboard.notification.service;

import com.cscreativ.billboard.notification.domain.NotificationType;
import com.cscreativ.billboard.user.events.UserRegisteredEvent;
import org.springframework.modulith.events.ApplicationModuleListener;
import org.springframework.stereotype.Component;

@Component
class UserNotificationListener {

    private final EmailService emailService;

    UserNotificationListener(EmailService emailService) {
        this.emailService = emailService;
    }

    @ApplicationModuleListener
    void onUserRegistered(UserRegisteredEvent event) {
        emailService.send(
                event.email(),
                NotificationType.USER_WELCOME,
                event.userId(),
                "Bienvenue sur AdSpace Market",
                EmailTemplates.welcome(event.companyName()));
    }
}
