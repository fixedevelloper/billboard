package com.cscreativ.billboard.notification.service;

import com.cscreativ.billboard.notification.domain.NotificationLog;
import com.cscreativ.billboard.notification.domain.NotificationLogRepository;
import com.cscreativ.billboard.notification.domain.NotificationType;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.UUID;

/**
 * Sends transactional HTML emails and records every attempt in {@link NotificationLog},
 * so a broken SMTP relay never fails the business operation that triggered the email
 * (callers should invoke this from an async, after-commit event listener).
 */
@Service
class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final MailProperties properties;
    private final NotificationLogRepository notificationLogRepository;

    EmailService(JavaMailSender mailSender, MailProperties properties, NotificationLogRepository notificationLogRepository) {
        this.mailSender = mailSender;
        this.properties = properties;
        this.notificationLogRepository = notificationLogRepository;
    }

    void send(String to, NotificationType type, UUID relatedId, String subject, String htmlBody) {
        if (!properties.enabled()) {
            log.debug("Mail sending disabled, skipping {} to {}", type, to);
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");
            helper.setFrom(properties.fromAddress(), properties.fromName());
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            mailSender.send(message);
            notificationLogRepository.save(NotificationLog.sent(to, type, relatedId, subject));
        } catch (Exception e) {
            log.error("Failed to send {} email to {}", type, to, e);
            notificationLogRepository.save(NotificationLog.failed(to, type, relatedId, subject, e.getMessage()));
        }
    }
}
