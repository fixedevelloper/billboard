package com.cscreativ.billboard.notification.web;

import com.cscreativ.billboard.notification.domain.NotificationLog;
import com.cscreativ.billboard.notification.domain.NotificationLogRepository;
import com.cscreativ.billboard.notification.domain.NotificationStatus;
import com.cscreativ.billboard.notification.domain.NotificationType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

/** Lets a user see the emails the platform has sent them (welcome, order updates, ...). */
@RestController
@RequestMapping("/api/notifications")
class NotificationController {

    private final NotificationLogRepository notificationLogRepository;

    NotificationController(NotificationLogRepository notificationLogRepository) {
        this.notificationLogRepository = notificationLogRepository;
    }

    @GetMapping("/mine")
    List<NotificationResponse> mine(Authentication authentication) {
        return notificationLogRepository.findByRecipientEmailOrderByCreatedAtDesc(authentication.getName())
                .stream()
                .map(NotificationResponse::from)
                .toList();
    }

    record NotificationResponse(UUID id, NotificationType type, String subject, NotificationStatus status, Instant createdAt) {
        static NotificationResponse from(NotificationLog log) {
            return new NotificationResponse(log.getId(), log.getType(), log.getSubject(), log.getStatus(), log.getCreatedAt());
        }
    }
}
