package com.cscreativ.billboard.shared.domain;

/**
 * Immutable geographic coordinate shared by the billboard and proof-of-performance modules.
 */
public record GeoLocation(double latitude, double longitude) {

    public GeoLocation {
        if (latitude < -90 || latitude > 90) {
            throw new IllegalArgumentException("Latitude must be between -90 and 90");
        }
        if (longitude < -180 || longitude > 180) {
            throw new IllegalArgumentException("Longitude must be between -180 and 180");
        }
    }
}
