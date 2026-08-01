package com.cscreativ.billboard.user;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Exercises registration end-to-end through a real HTTP request, which publishes
 * UserRegisteredEvent and, since the notification listeners are now
 * {@code @ApplicationModuleListener}, synchronously persists a row into the Modulith
 * event publication registry as part of the same transaction. This is the most
 * reliable way to confirm the registry's schema (see V5__event_publication.sql)
 * actually matches what Hibernate expects at runtime, not just at static validation.
 */
@SpringBootTest
@AutoConfigureMockMvc
class AuthRegistrationIT {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void registeringAUserPublishesAndPersistsTheWelcomeEvent() throws Exception {
        String body = """
                {
                  "email": "modulith-events-it@example.com",
                  "password": "password123",
                  "companyName": "Test Co",
                  "role": "ANNONCEUR"
                }
                """;

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk());
    }
}
