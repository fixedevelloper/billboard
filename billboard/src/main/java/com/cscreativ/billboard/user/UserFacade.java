package com.cscreativ.billboard.user;

import com.cscreativ.billboard.shared.domain.Role;

import java.util.Optional;
import java.util.UUID;

/**
 * Public API exposed by the user module to the rest of the application.
 * Other modules (billboard, booking, payment, proofofperformance) must only
 * depend on this facade, never on {@code user.internal} types.
 */
public interface UserFacade {

    Optional<UserSummary> findById(UUID userId);

    UserSummary getById(UUID userId);

    Optional<UserSummary> findByEmail(String email);

    UserSummary getByEmail(String email);

    boolean existsWithRole(UUID userId, Role role);

    boolean isKycVerified(UUID userId);

    record UserSummary(UUID id, String email, String companyName, Role role, boolean kycVerified) {
    }
}
