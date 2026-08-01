package com.cscreativ.billboard.user.service;

import com.cscreativ.billboard.shared.domain.Role;
import com.cscreativ.billboard.user.UserFacade;
import com.cscreativ.billboard.user.domain.User;
import com.cscreativ.billboard.user.domain.UserRepository;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;

@Service
class UserService implements UserFacade {

    private final UserRepository userRepository;

    UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public Optional<UserSummary> findById(UUID userId) {
        return userRepository.findById(userId).map(UserService::toSummary);
    }

    @Override
    public UserSummary getById(UUID userId) {
        return findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found: " + userId));
    }

    @Override
    public Optional<UserSummary> findByEmail(String email) {
        return userRepository.findByEmail(email).map(UserService::toSummary);
    }

    @Override
    public UserSummary getByEmail(String email) {
        return findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("User not found: " + email));
    }

    @Override
    public boolean existsWithRole(UUID userId, Role role) {
        return userRepository.findById(userId)
                .map(user -> user.getRole() == role)
                .orElse(false);
    }

    @Override
    public boolean isKycVerified(UUID userId) {
        return userRepository.findById(userId)
                .map(User::isKycVerified)
                .orElse(false);
    }

    private static UserSummary toSummary(User user) {
        return new UserSummary(user.getId(), user.getEmail(), user.getCompanyName(), user.getRole(), user.isKycVerified());
    }
}
