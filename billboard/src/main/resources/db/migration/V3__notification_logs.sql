-- Audit trail of every transactional email the platform has attempted to send.

create table notification_logs (
    id               char(36)      not null primary key,
    recipient_email  varchar(255)  not null,
    type             varchar(30)   not null,
    related_id       char(36),
    subject          varchar(255)  not null,
    status           varchar(20)   not null,
    error_message    varchar(2000),
    created_at       timestamp     not null default current_timestamp
);

create index idx_notification_logs_recipient on notification_logs (recipient_email);
