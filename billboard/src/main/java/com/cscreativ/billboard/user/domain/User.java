package com.cscreativ.billboard.user.domain;

import com.cscreativ.billboard.shared.domain.Role;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Column(nullable = false)
    private String companyName;

    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private KycStatus kycStatus = KycStatus.PENDING;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public User(String email, String passwordHash, String companyName, String phone, Role role) {
        this.email = email;
        this.passwordHash = passwordHash;
        this.companyName = companyName;
        this.phone = phone;
        this.role = role;
        this.kycStatus = KycStatus.PENDING;
    }

    public boolean isKycVerified() {
        return kycStatus == KycStatus.VERIFIED;
    }
}
