-- Per-user image metadata. The actual bytes live in MinIO under users/<owner_id>/...;
-- this table is what scopes list/delete operations to the uploading user.

create table stored_images (
    id                 char(36)     not null primary key,
    owner_id           char(36)     not null,
    object_key         varchar(500) not null,
    original_filename  varchar(255) not null,
    content_type       varchar(100) not null,
    size_bytes         bigint       not null,
    created_at         timestamp    not null default current_timestamp,
    constraint uk_stored_images_object_key unique (object_key)
);

create index idx_stored_images_owner on stored_images (owner_id);
