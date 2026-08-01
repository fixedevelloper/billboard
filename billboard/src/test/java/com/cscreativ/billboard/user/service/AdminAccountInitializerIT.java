package com.cscreativ.billboard.user.service;

import com.cscreativ.billboard.shared.domain.Role;
import com.cscreativ.billboard.user.domain.KycStatus;
import com.cscreativ.billboard.user.domain.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.DefaultApplicationArguments;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Confirms the ADMIN account described by app.admin.* (ADMIN_EMAIL/ADMIN_PASSWORD in .env) is
 * created once at startup and that re-running the bootstrap (e.g. a later restart) is a no-op.
 */
@SpringBootTest(properties = {
        "app.admin.email=bootstrap-admin@adspacemarket.com",
        "app.admin.password=Sup3rSecret!",
        "app.admin.company-name=AdSpace Market HQ"
})
class AdminAccountInitializerIT {

    private static final String ADMIN_EMAIL = "bootstrap-admin@adspacemarket.com";

    @Autowired
    private AdminAccountInitializer adminAccountInitializer;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    void bootstrapsTheAdminAccountOnceAndIsIdempotentOnRerun() {
        var admin = userRepository.findByEmail(ADMIN_EMAIL).orElseThrow();

        assertThat(admin.getRole()).isEqualTo(Role.ADMIN);
        assertThat(admin.getKycStatus()).isEqualTo(KycStatus.VERIFIED);
        assertThat(admin.getCompanyName()).isEqualTo("AdSpace Market HQ");
        assertThat(passwordEncoder.matches("Sup3rSecret!", admin.getPasswordHash())).isTrue();

        long usersBefore = userRepository.count();

        adminAccountInitializer.run(new DefaultApplicationArguments());

        assertThat(userRepository.count()).isEqualTo(usersBefore);
        assertThat(userRepository.findByEmail(ADMIN_EMAIL).orElseThrow().getId()).isEqualTo(admin.getId());
    }
}
