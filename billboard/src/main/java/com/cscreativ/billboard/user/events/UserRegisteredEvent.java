package com.cscreativ.billboard.user.events;

import com.cscreativ.billboard.shared.domain.Role;

import java.time.Instant;
import java.util.UUID;

/** Published once a new account has been created and persisted. */
public record UserRegisteredEvent(UUID userId, String email, String companyName, Role role, Instant occurredAt) {

    public UserRegisteredEvent(UUID userId, String email, String companyName, Role role) {
        this(userId, email, companyName, role, Instant.now());
    }
}
