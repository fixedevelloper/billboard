package com.cscreativ.billboard.media.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

/**
 * Metadata for an image stored in MinIO under the {@code users/<ownerId>/...} prefix.
 * MinIO holds the bytes; this row is what lets a user list/delete only their own images.
 */
@Entity
@Table(name = "stored_images")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class StoredImage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /** Id of the user (user module) this image belongs to; also the MinIO key prefix. */
    @Column(nullable = false)
    private UUID ownerId;

    @Column(nullable = false, unique = true)
    private String objectKey;

    @Column(nullable = false)
    private String originalFilename;

    @Column(nullable = false)
    private String contentType;

    @Column(nullable = false)
    private long sizeBytes;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public StoredImage(UUID ownerId, String objectKey, String originalFilename, String contentType, long sizeBytes) {
        this.ownerId = ownerId;
        this.objectKey = objectKey;
        this.originalFilename = originalFilename;
        this.contentType = contentType;
        this.sizeBytes = sizeBytes;
    }
}
