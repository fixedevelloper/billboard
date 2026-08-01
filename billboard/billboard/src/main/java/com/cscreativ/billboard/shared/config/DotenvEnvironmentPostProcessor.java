package com.cscreativ.billboard.shared.config;

import org.springframework.boot.EnvironmentPostProcessor;
import org.springframework.boot.SpringApplication;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.PropertiesPropertySource;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Properties;

/**
 * Loads a {@code .env} file (if present) from the working directory into the Spring
 * Environment, at the lowest priority so real OS/CI environment variables always win.
 *
 * <p>Replaces the {@code me.paulschwarz:spring-dotenv} library, which silently does
 * nothing on Spring Boot 4: it implements {@code environmentPrepared} against the
 * pre-4.0 {@code org.springframework.boot.ConfigurableBootstrapContext} type, which
 * moved to {@code org.springframework.boot.bootstrap} in Boot 4, so its listener
 * method no longer overrides the current {@code SpringApplicationRunListener}
 * interface and is never invoked.
 */
public class DotenvEnvironmentPostProcessor implements EnvironmentPostProcessor {

    private static final String DOTENV_FILENAME = ".env";
    private static final String PROPERTY_SOURCE_NAME = "dotenv";

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        Path envFile = Path.of(DOTENV_FILENAME);
        if (!Files.isRegularFile(envFile)) {
            return;
        }

        try {
            Properties properties = parse(Files.readAllLines(envFile));
            if (!properties.isEmpty()) {
                environment.getPropertySources().addLast(new PropertiesPropertySource(PROPERTY_SOURCE_NAME, properties));
            }
        } catch (IOException e) {
            throw new IllegalStateException("Failed to read " + envFile.toAbsolutePath(), e);
        }
    }

    private Properties parse(List<String> lines) {
        Properties properties = new Properties();
        for (String rawLine : lines) {
            String line = rawLine.strip();
            if (line.isEmpty() || line.startsWith("#")) {
                continue;
            }
            if (line.startsWith("export ")) {
                line = line.substring("export ".length()).strip();
            }

            int separator = line.indexOf('=');
            if (separator <= 0) {
                continue;
            }

            String key = line.substring(0, separator).strip();
            String value = unquote(line.substring(separator + 1).strip());
            properties.setProperty(key, value);
        }
        return properties;
    }

    private String unquote(String value) {
        boolean quoted = value.length() >= 2
                && ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'")));
        return quoted ? value.substring(1, value.length() - 1) : value;
    }
}
