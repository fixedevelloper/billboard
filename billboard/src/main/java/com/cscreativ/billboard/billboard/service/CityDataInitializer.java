package com.cscreativ.billboard.billboard.service;

import com.cscreativ.billboard.billboard.domain.City;
import com.cscreativ.billboard.billboard.domain.CityRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.List;

/** Seeds the searchable city list once at startup if the table is empty. */
@Component
class CityDataInitializer implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(CityDataInitializer.class);

    private static final List<City> SEED_CITIES = List.of(
            new City("Lomé", "TG", 6.1319, 1.2228),
            new City("Kara", "TG", 9.5511, 1.1861),
            new City("Sokodé", "TG", 8.9833, 1.1333),
            new City("Lagos", "NG", 6.5244, 3.3792),
            new City("Abuja", "NG", 9.0765, 7.3986),
            new City("Accra", "GH", 5.6037, -0.1870),
            new City("Kumasi", "GH", 6.6885, -1.6244),
            new City("Abidjan", "CI", 5.3600, -4.0083),
            new City("Yamoussoukro", "CI", 6.8276, -5.2893),
            new City("Cotonou", "BJ", 6.3703, 2.3912),
            new City("Porto-Novo", "BJ", 6.4969, 2.6289),
            new City("Dakar", "SN", 14.7167, -17.4677),
            new City("Bamako", "ML", 12.6392, -8.0029),
            new City("Ouagadougou", "BF", 12.3714, -1.5197),
            new City("Niamey", "NE", 13.5127, 2.1128),
            new City("Conakry", "GN", 9.6412, -13.5784),
            new City("Freetown", "SL", 8.4657, -13.2317),
            new City("Monrovia", "LR", 6.3004, -10.7969),
            new City("Douala", "CM", 4.0511, 9.7679),
            new City("Yaoundé", "CM", 3.8480, 11.5021));

    private final CityRepository cityRepository;

    CityDataInitializer(CityRepository cityRepository) {
        this.cityRepository = cityRepository;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (cityRepository.count() > 0) {
            return;
        }
        cityRepository.saveAll(SEED_CITIES);
        log.info("Seeded {} cities", SEED_CITIES.size());
    }
}
