package com.cscreativ.billboard.user.service;

import com.cscreativ.billboard.shared.domain.Role;
import com.cscreativ.billboard.user.domain.KycStatus;
import com.cscreativ.billboard.user.domain.User;
import com.cscreativ.billboard.user.domain.UserRepository;
import com.cscreativ.billboard.user.events.UserRegisteredEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Bootstraps the platform's ADMIN account from app.admin.* (ADMIN_EMAIL / ADMIN_PASSWORD in
 * .env) on startup. Guarded by {@link UserRepository#existsByEmail(String)} so it only ever
 * creates the account once; every later restart is a no-op.
 */
@Component
@EnableConfigurationProperties(AdminProperties.class)
class AdminAccountInitializer implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminAccountInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ApplicationEventPublisher eventPublisher;
    private final AdminProperties adminProperties;

    AdminAccountInitializer(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            ApplicationEventPublisher eventPublisher,
            AdminProperties adminProperties) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.eventPublisher = eventPublisher;
        this.adminProperties = adminProperties;
    }

    @Override
    public void run(ApplicationArguments args) {
        String email = adminProperties.email();
        String password = adminProperties.password();
        if (email == null || email.isBlank() || password == null || password.isBlank()) {
            log.warn("ADMIN_EMAIL/ADMIN_PASSWORD not set: skipping admin account bootstrap");
            return;
        }
        if (userRepository.existsByEmail(email)) {
            return;
        }

        String companyName = adminProperties.companyName() == null || adminProperties.companyName().isBlank()
                ? "AdSpace Market"
                : adminProperties.companyName();

        User admin = new User(email, passwordEncoder.encode(password), companyName, null, Role.ADMIN);
        admin.setKycStatus(KycStatus.VERIFIED);
        userRepository.save(admin);

        eventPublisher.publishEvent(
                new UserRegisteredEvent(admin.getId(), admin.getEmail(), admin.getCompanyName(), admin.getRole()));

        log.info("Bootstrapped ADMIN account for {}", email);
    }
}
