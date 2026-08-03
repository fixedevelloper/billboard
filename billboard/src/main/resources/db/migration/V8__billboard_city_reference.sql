-- Links a billboard to the city it was created against (see CitySelect on the
-- frontend and the city lookup now done server-side in BillboardController).
-- Nullable because billboards created before this feature existed have no
-- matching city row.

alter table billboards add column city_id char(36) null;

alter table billboards
    add constraint fk_billboard_city foreign key (city_id) references cities (id);

create index idx_billboard_city_id on billboards (city_id);
