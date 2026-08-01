-- AdSpace Market - Phase 1 MVP schema
-- One table per module aggregate root; modules never join across each other's tables,
-- they only reference foreign ids (owner_id, billboard_id, order_id, ...).

create table users (
    id              char(36)     not null primary key,
    email           varchar(255) not null,
    password_hash   varchar(255) not null,
    company_name    varchar(255) not null,
    phone           varchar(50),
    role            varchar(30)  not null,
    kyc_status      varchar(20)  not null default 'PENDING',
    created_at      timestamp    not null default current_timestamp,
    constraint uk_users_email unique (email)
);

create table billboards (
    id              char(36)      not null primary key,
    owner_id        char(36)      not null,
    title           varchar(255)  not null,
    description     varchar(2000),
    type            varchar(10)   not null,
    format          varchar(100)  not null,
    city            varchar(100)  not null,
    country         varchar(100)  not null,
    address         varchar(255),
    latitude        double        not null,
    longitude       double        not null,
    monthly_price   decimal(12,2) not null,
    currency        varchar(3)    not null,
    status          varchar(20)   not null default 'AVAILABLE',
    image_url       varchar(500),
    created_at      timestamp     not null default current_timestamp
);

create index idx_billboards_city on billboards (city);
create index idx_billboards_owner on billboards (owner_id);
create index idx_billboards_location on billboards (latitude, longitude);

create table orders (
    id                            char(36)      not null primary key,
    annonceur_id                  char(36)      not null,
    delegated_to_media_buyer_id   char(36),
    status                        varchar(20)   not null default 'DRAFT',
    total_amount                  decimal(12,2) not null default 0,
    currency                      varchar(3)    not null,
    created_at                    timestamp     not null default current_timestamp
);

create index idx_orders_annonceur on orders (annonceur_id);
create index idx_orders_media_buyer on orders (delegated_to_media_buyer_id);

create table order_items (
    id              char(36)      not null primary key,
    order_id        char(36)      not null,
    billboard_id    char(36)      not null,
    unit_price      decimal(12,2) not null,
    start_date      date          not null,
    end_date        date          not null,
    constraint fk_order_items_order foreign key (order_id) references orders (id)
);

create index idx_order_items_order on order_items (order_id);

create table payments (
    id           char(36)      not null primary key,
    order_id     char(36)      not null,
    payer_id     char(36)      not null,
    amount       decimal(12,2) not null,
    currency     varchar(3)    not null,
    method       varchar(20),
    status       varchar(20)   not null default 'PENDING',
    created_at   timestamp     not null default current_timestamp,
    settled_at   timestamp,
    constraint uk_payments_order unique (order_id)
);

create table wallets (
    id           char(36)      not null primary key,
    owner_id     char(36)      not null,
    balance      decimal(12,2) not null default 0,
    currency     varchar(3)    not null,
    constraint uk_wallets_owner unique (owner_id)
);

create table proofs_of_performance (
    id            char(36)   not null primary key,
    order_id      char(36)   not null,
    billboard_id  char(36)   not null,
    captured_by   char(36)   not null,
    photo_url     varchar(500) not null,
    latitude      double     not null,
    longitude     double     not null,
    captured_at   timestamp  not null,
    created_at    timestamp  not null default current_timestamp
);

create index idx_pop_order on proofs_of_performance (order_id);
create index idx_pop_billboard on proofs_of_performance (billboard_id);
