package com.cscreativ.billboard;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Set;

@SpringBootApplication
@EnableAsync
@EnableScheduling
public class BillboardApplication {

	private static final Logger log = LoggerFactory.getLogger(BillboardApplication.class);

	// Liste des clés dont la valeur doit être masquée dans la console
	private static final Set<String> SENSITIVE_KEYS = Set.of(
			"DB_PASSWORD", "JWT_SECRET", "MINIO_SECRET_KEY", "MAIL_PASSWORD", "ADMIN_PASSWORD"
	);

	public static void main(String[] args) {
		// 1. Charger le fichier .env en mémoire avant Spring
		loadDotEnv();

		// 2. Démarrer l'application Spring Boot
		SpringApplication.run(BillboardApplication.class, args);
	}

	private static void loadDotEnv() {
		Path envPath = Paths.get(".env");

		log.info("==================================================");
		log.info("🔄 Initialisation : Lecture du fichier .env...");
		log.info("==================================================");

		if (!Files.exists(envPath)) {
			log.warn("⚠️  Fichier .env introuvable à la racine : {}", envPath.toAbsolutePath());
			log.info("==================================================");
			return;
		}

		try {
			List<String> lines = Files.readAllLines(envPath);
			int count = 0;

			for (String line : lines) {
				String trimmed = line.trim();

				// Ignorer les lignes vides, les commentaires (#) ou sans signe =
				if (trimmed.isEmpty() || trimmed.startsWith("#") || !trimmed.contains("=")) {
					continue;
				}

				int eqIdx = trimmed.indexOf('=');
				String key = trimmed.substring(0, eqIdx).trim();
				String value = trimmed.substring(eqIdx + 1).trim();

				// Supprimer les guillemets entourant la valeur si présents ("valeur" ou 'valeur')
				if ((value.startsWith("\"") && value.endsWith("\"")) ||
						(value.startsWith("'") && value.endsWith("'"))) {
					value = value.substring(1, value.length() - 1);
				}

				// Injecter la variable dans les propriétés système
				System.setProperty(key, value);
				count++;

				// Log avec masquage si sensible
				if (SENSITIVE_KEYS.contains(key.toUpperCase())) {
					log.info("🔑 Variable chargée : {} = *******", key);
				} else {
					log.info("⚙️  Variable chargée : {} = {}", key, value);
				}
			}

			log.info("✅ {} variable(s) d'environnement chargée(s) avec succès.", count);

		} catch (IOException e) {
			log.error("❌ Erreur lors de la lecture du fichier .env", e);
		}

		log.info("==================================================");
		log.info("🚀 Démarrage du contexte Spring Boot...");
		log.info("==================================================");
	}

}
