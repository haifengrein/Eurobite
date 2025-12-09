CREATE TABLE category (
    id BIGSERIAL PRIMARY KEY,
    type INTEGER NOT NULL, -- 1: Dish, 2: Setmeal
    name VARCHAR(64) NOT NULL UNIQUE,
    sort INTEGER DEFAULT 0,
    create_time TIMESTAMP,
    update_time TIMESTAMP,
    create_user BIGINT,
    update_user BIGINT
);
COMMENT ON TABLE category IS 'Dish/Setmeal Category';
