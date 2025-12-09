CREATE TABLE dish (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(64) NOT NULL UNIQUE,
    category_id BIGINT NOT NULL,
    price DECIMAL(10, 2),
    code VARCHAR(64),
    image VARCHAR(200),
    description VARCHAR(400),
    status INTEGER DEFAULT 1,
    sort INTEGER DEFAULT 0,
    create_time TIMESTAMP,
    update_time TIMESTAMP,
    create_user BIGINT,
    update_user BIGINT
);

CREATE TABLE dish_flavor (
    id BIGSERIAL PRIMARY KEY,
    dish_id BIGINT NOT NULL,
    name VARCHAR(64),
    value VARCHAR(500),
    create_time TIMESTAMP,
    update_time TIMESTAMP,
    create_user BIGINT,
    update_user BIGINT
);

CREATE INDEX idx_dish_category_id ON dish(category_id);
CREATE INDEX idx_dish_flavor_dish_id ON dish_flavor(dish_id);
