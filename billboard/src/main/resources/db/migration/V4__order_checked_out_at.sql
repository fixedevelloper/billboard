-- When an order left DRAFT for PENDING_PAYMENT; used to auto-expire unpaid orders.
alter table orders add column checked_out_at timestamp null;

create index idx_orders_checked_out_at on orders (checked_out_at);
