package com.cscreativ.billboard.notification.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

/** Audit trail of every email the platform has attempted to send. */
@Entity
@Table(name = "notification_logs")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class NotificationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String recipientEmail;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType type;

    /** Id of the entity this notification is about (userId, orderId, ...), for traceability. */
    private UUID relatedId;

    @Column(nullable = false)
    private String subject;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationStatus status;

    @Column(length = 2000)
    private String errorMessage;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    private NotificationLog(String recipientEmail, NotificationType type, UUID relatedId, String subject,
                             NotificationStatus status, String errorMessage) {
        this.recipientEmail = recipientEmail;
        this.type = type;
        this.relatedId = relatedId;
        this.subject = subject;
        this.status = status;
        this.errorMessage = errorMessage;
    }

    public static NotificationLog sent(String recipientEmail, NotificationType type, UUID relatedId, String subject) {
        return new NotificationLog(recipientEmail, type, relatedId, subject, NotificationStatus.SENT, null);
    }

    public static NotificationLog failed(String recipientEmail, NotificationType type, UUID relatedId, String subject, String errorMessage) {
        return new NotificationLog(recipientEmail, type, relatedId, subject, NotificationStatus.FAILED, errorMessage);
    }
}
