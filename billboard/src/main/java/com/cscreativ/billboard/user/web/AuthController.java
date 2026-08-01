package com.cscreativ.billboard.user.web;

import com.cscreativ.billboard.shared.security.JwtService;
import com.cscreativ.billboard.user.domain.User;
import com.cscreativ.billboard.user.domain.UserRepository;
import com.cscreativ.billboard.user.events.UserRegisteredEvent;
import com.cscreativ.billboard.user.service.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Registration and login endpoints for annonceurs, media buyers and regisseurs.
 */
@RestController
@RequestMapping("/api/auth")
class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final ApplicationEventPublisher eventPublisher;

    AuthController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            ApplicationEventPublisher eventPublisher) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.eventPublisher = eventPublisher;
    }

    @PostMapping("/register")
    ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalStateException("An account already exists with email " + request.email());
        }

        User user = new User(
                request.email(),
                passwordEncoder.encode(request.password()),
                request.companyName(),
                request.phone(),
                request.role());
        userRepository.save(user);
        eventPublisher.publishEvent(new UserRegisteredEvent(user.getId(), user.getEmail(), user.getCompanyName(), user.getRole()));

        String token = jwtService.generateToken(UserPrincipal.of(user));
        return ResponseEntity.ok(toAuthResponse(user, token));
    }

    @PostMapping("/login")
    ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password()));

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalStateException("Invalid credentials"));

        String token = jwtService.generateToken(UserPrincipal.of(user));
        return ResponseEntity.ok(toAuthResponse(user, token));
    }

    private AuthResponse toAuthResponse(User user, String token) {
        return new AuthResponse(token, user.getId(), user.getEmail(), user.getCompanyName(), user.getRole());
    }
}
