CREATE TABLE setmeal (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT NOT NULL,
    name VARCHAR(64) NOT NULL UNIQUE,
    price DECIMAL(10, 2) NOT NULL,
    status INTEGER DEFAULT 1,
    code VARCHAR(64),
    description VARCHAR(400),
    image VARCHAR(200),
    create_time TIMESTAMP,
    update_time TIMESTAMP,
    create_user BIGINT,
    update_user BIGINT
);

CREATE TABLE setmeal_dish (
    id BIGSERIAL PRIMARY KEY,
    setmeal_id BIGINT NOT NULL,
    dish_id BIGINT NOT NULL,
    name VARCHAR(64),
    price DECIMAL(10, 2),
    copies INTEGER DEFAULT 1,
    sort INTEGER DEFAULT 0,
    create_time TIMESTAMP,
    update_time TIMESTAMP,
    create_user BIGINT,
    update_user BIGINT
);

CREATE INDEX idx_setmeal_category_id ON setmeal(category_id);
CREATE INDEX idx_setmeal_dish_setmeal_id ON setmeal_dish(setmeal_id);
