package com.cscreativ.billboard.notification.service;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.notification.mail")
public record MailProperties(boolean enabled, String fromAddress, String fromName) {
}
