-- 1. Ajout des nouvelles colonnes à la table billboards
ALTER TABLE billboards
    ADD COLUMN code_reference VARCHAR(50) NULL,
    ADD COLUMN width DECIMAL(5, 2) NULL,
    ADD COLUMN height DECIMAL(5, 2) NULL,
    ADD COLUMN faces_count INT NOT NULL DEFAULT 1,
    ADD COLUMN is_illuminated BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN is_digital BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN resolution VARCHAR(255) NULL,
    ADD COLUMN spot_duration_seconds INT NULL,
    ADD COLUMN environment_type VARCHAR(255) NULL,
    ADD COLUMN orientation VARCHAR(255) NULL,
    ADD COLUMN daily_impressions BIGINT NULL,
    ADD COLUMN daily_price DECIMAL(12, 2) NULL,
    ADD COLUMN min_booking_days INT NOT NULL DEFAULT 30,
    ADD COLUMN is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- 2. Génération d'un code_reference par défaut pour les enregistrements existants
UPDATE billboards
SET code_reference = CONCAT('BILL-', UPPER(LEFT(CAST(id AS CHAR), 8)))
WHERE code_reference IS NULL;

-- 3. Application des contraintes NOT NULL et UNIQUE sur code_reference
ALTER TABLE billboards
    MODIFY COLUMN code_reference VARCHAR(50) NOT NULL,
    ADD CONSTRAINT uq_billboards_code_reference UNIQUE (code_reference);

-- 4. Création de la table pour la galerie d'images (@ElementCollection)
-- Note : Adaptez le type de billboard_id (VARCHAR(36) ou BINARY(16)) selon la définition de votre colonne ID dans billboards
CREATE TABLE billboard_images (
                                  billboard_id VARCHAR(36) NOT NULL,
                                  image_url VARCHAR(1000) NOT NULL,
                                  CONSTRAINT fk_billboard_images_billboard
                                      FOREIGN KEY (billboard_id)
                                          REFERENCES billboards (id)
                                          ON DELETE CASCADE
);

-- 5. Création des index
CREATE INDEX idx_billboard_city_status ON billboards (city, status);
CREATE INDEX idx_billboard_owner ON billboards (owner_id);
CREATE INDEX idx_billboard_images_billboard_id ON billboard_images (billboard_id);