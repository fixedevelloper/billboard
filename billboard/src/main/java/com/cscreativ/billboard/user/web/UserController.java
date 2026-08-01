package com.cscreativ.billboard.user.web;

import com.cscreativ.billboard.user.domain.KycStatus;
import com.cscreativ.billboard.user.domain.User;
import com.cscreativ.billboard.user.domain.UserRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.NoSuchElementException;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
class UserController {

    private final UserRepository userRepository;

    UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    UserResponse me(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new NoSuchElementException("User not found"));
        return UserResponse.from(user);
    }

    @PatchMapping("/{id}/kyc")
    @PreAuthorize("hasRole('ADMIN')")
    UserResponse updateKycStatus(@PathVariable UUID id, @RequestBody KycUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("User not found: " + id));
        user.setKycStatus(request.status());
        userRepository.save(user);
        return UserResponse.from(user);
    }

    record UserResponse(UUID id, String email, String companyName, String phone, String role, String kycStatus) {
        static UserResponse from(User user) {
            return new UserResponse(
                    user.getId(), user.getEmail(), user.getCompanyName(), user.getPhone(),
                    user.getRole().name(), user.getKycStatus().name());
        }
    }

    record KycUpdateRequest(KycStatus status) {
    }
}
