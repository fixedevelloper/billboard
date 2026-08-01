-- Spring Modulith's event publication registry: durably records every published
-- event so a listener that failed (crash, SMTP outage, ...) can be retried on restart.
-- Table/column names are fixed by org.springframework.modulith.events.jpa.JpaEventPublication.

create table event_publication (
    id                     char(36)      not null primary key,
    listener_id            varchar(512)  not null,
    event_type             varchar(512)  not null,
    serialized_event       text          not null,
    publication_date       timestamp(6)  not null,
    completion_date        timestamp(6),
    last_resubmission_date timestamp(6),
    completion_attempts    integer       not null default 0,
    status                 varchar(20)
);

create index idx_event_publication_completion on event_publication (completion_date);
