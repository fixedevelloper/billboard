package com.cscreativ.billboard.notification.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationLogRepository extends JpaRepository<NotificationLog, java.util.UUID> {

    List<NotificationLog> findByRecipientEmailOrderByCreatedAtDesc(String recipientEmail);
}
