package com.cscreativ.billboard.media.web;

import com.cscreativ.billboard.media.domain.StoredImage;
import com.cscreativ.billboard.media.service.StorageService;
import com.cscreativ.billboard.user.UserFacade;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

/** Every authenticated user manages their own images, isolated by owner id in MinIO and in the DB. */
@RestController
@RequestMapping("/api/media")
class MediaController {

    private final StorageService storageService;
    private final UserFacade userFacade;

    MediaController(StorageService storageService, UserFacade userFacade) {
        this.storageService = storageService;
        this.userFacade = userFacade;
    }

    @PostMapping(value = "/upload", consumes = "multipart/form-data")
    ResponseEntity<ImageResponse> upload(@RequestParam("file") MultipartFile file, Authentication authentication) {
        UUID ownerId = currentUserId(authentication);
        StoredImage image = storageService.upload(ownerId, file);
        return ResponseEntity.ok(toResponse(image));
    }

    @GetMapping("/mine")
    List<ImageResponse> mine(Authentication authentication) {
        UUID ownerId = currentUserId(authentication);
        return storageService.listMine(ownerId).stream().map(this::toResponse).toList();
    }

    @DeleteMapping("/{id}")
    ResponseEntity<Void> delete(@PathVariable UUID id, Authentication authentication) {
        storageService.delete(id, currentUserId(authentication));
        return ResponseEntity.noContent().build();
    }

    private UUID currentUserId(Authentication authentication) {
        return userFacade.getByEmail(authentication.getName()).id();
    }

    private ImageResponse toResponse(StoredImage image) {
        return new ImageResponse(
                image.getId(), storageService.presignedUrl(image), image.getOriginalFilename(),
                image.getContentType(), image.getSizeBytes(), image.getCreatedAt());
    }

    record ImageResponse(UUID id, String url, String filename, String contentType, long sizeBytes, Instant createdAt) {
    }
}
