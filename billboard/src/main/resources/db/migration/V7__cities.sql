-- Reference list of searchable cities used to fill in a billboard's location
-- (see City.java / CityController). Seeded with West African cities matching
-- the platform's initial market.

create table cities (
    id           char(36)      not null primary key,
    name         varchar(255)  not null,
    country_code varchar(2)    not null,
    latitude     double        not null,
    longitude    double        not null,
    active       boolean       not null default true,
    created_at   timestamp     not null default current_timestamp
);

create index idx_cities_name on cities (name);
create index idx_cities_active on cities (active);

-- Initial city list is seeded at application startup by CityDataInitializer
-- (portable UUID generation via JPA, consistent with AdminAccountInitializer).
