package com.cscreativ.billboard.media.service;

import com.cscreativ.billboard.media.domain.StoredImage;
import com.cscreativ.billboard.media.domain.StoredImageRepository;
import io.minio.BucketExistsArgs;
import io.minio.GetPresignedObjectUrlArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import io.minio.http.Method;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * Stores each user's images in MinIO under a per-owner key prefix
 * ({@code users/<ownerId>/<uuid>-<filename>}), so one user can never read,
 * list or delete another user's images.
 */
@Service
public class StorageService {

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of("image/jpeg", "image/png", "image/webp", "image/gif");
    private static final long MAX_FILE_SIZE_BYTES = 10L * 1024 * 1024; // 10 MB

    private final MinioClient minioClient;
    private final MinioProperties properties;
    private final StoredImageRepository storedImageRepository;
    private final AtomicBoolean bucketReady = new AtomicBoolean(false);

    public StorageService(MinioClient minioClient, MinioProperties properties, StoredImageRepository storedImageRepository) {
        this.minioClient = minioClient;
        this.properties = properties;
        this.storedImageRepository = storedImageRepository;
    }

    public StoredImage upload(UUID ownerId, MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }
        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new IllegalArgumentException("File exceeds the 10 MB limit");
        }
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
            throw new IllegalArgumentException("Only JPEG, PNG, WEBP or GIF images are accepted");
        }

        ensureBucketExists();

        String sanitizedFilename = sanitize(file.getOriginalFilename());
        String objectKey = "users/%s/%s-%s".formatted(ownerId, UUID.randomUUID(), sanitizedFilename);

        try (var inputStream = file.getInputStream()) {
            minioClient.putObject(PutObjectArgs.builder()
                    .bucket(properties.bucket())
                    .object(objectKey)
                    .stream(inputStream, file.getSize(), -1)
                    .contentType(contentType)
                    .build());
        } catch (Exception e) {
            throw new IllegalStateException("Failed to upload image to storage", e);
        }

        StoredImage image = new StoredImage(ownerId, objectKey, sanitizedFilename, contentType, file.getSize());
        return storedImageRepository.save(image);
    }

    public List<StoredImage> listMine(UUID ownerId) {
        return storedImageRepository.findByOwnerIdOrderByCreatedAtDesc(ownerId);
    }

    public void delete(UUID imageId, UUID requesterId) {
        StoredImage image = storedImageRepository.findById(imageId)
                .orElseThrow(() -> new NoSuchElementException("Image not found: " + imageId));
        if (!image.getOwnerId().equals(requesterId)) {
            throw new IllegalStateException("You do not own this image");
        }

        try {
            minioClient.removeObject(RemoveObjectArgs.builder()
                    .bucket(properties.bucket())
                    .object(image.getObjectKey())
                    .build());
        } catch (Exception e) {
            throw new IllegalStateException("Failed to delete image from storage", e);
        }

        storedImageRepository.delete(image);
    }

    public String presignedUrl(StoredImage image) {
        try {
            return minioClient.getPresignedObjectUrl(GetPresignedObjectUrlArgs.builder()
                    .method(Method.GET)
                    .bucket(properties.bucket())
                    .object(image.getObjectKey())
                    .expiry((int) properties.presignedUrlExpiryMinutes(), TimeUnit.MINUTES)
                    .build());
        } catch (Exception e) {
            throw new IllegalStateException("Failed to generate a download URL", e);
        }
    }

    private void ensureBucketExists() {
        if (bucketReady.get()) {
            return;
        }
        try {
            boolean exists = minioClient.bucketExists(BucketExistsArgs.builder().bucket(properties.bucket()).build());
            if (!exists) {
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(properties.bucket()).build());
            }
            bucketReady.set(true);
        } catch (Exception e) {
            throw new IllegalStateException("Failed to reach storage backend", e);
        }
    }

    private String sanitize(String filename) {
        if (filename == null || filename.isBlank()) {
            return "image";
        }
        return filename.replaceAll("[^a-zA-Z0-9._-]", "_");
    }
}
