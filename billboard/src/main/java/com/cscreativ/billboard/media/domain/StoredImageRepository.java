package com.cscreativ.billboard.media.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface StoredImageRepository extends JpaRepository<StoredImage, UUID> {

    List<StoredImage> findByOwnerIdOrderByCreatedAtDesc(UUID ownerId);
}
