package com.cscreativ.billboard.user.web;

import com.cscreativ.billboard.shared.domain.Role;

import java.util.UUID;

record AuthResponse(String token, UUID userId, String email, String companyName, Role role) {
}
