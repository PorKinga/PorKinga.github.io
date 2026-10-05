create table pizza
(
    id      integer not null
        constraint pizza_pk
            primary key autoincrement,
    name text not null,
    price text not null,
    description text not null
);
