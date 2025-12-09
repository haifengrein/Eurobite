CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(64),
    phone VARCHAR(20) NOT NULL UNIQUE,
    sex VARCHAR(4),
    id_number VARCHAR(32),
    avatar VARCHAR(255),
    status INTEGER DEFAULT 1,
    create_time TIMESTAMP,
    update_time TIMESTAMP,
    create_user BIGINT,
    update_user BIGINT
);

CREATE TABLE address_book (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    consignee VARCHAR(64),
    sex VARCHAR(4),
    phone VARCHAR(20),
    province_code VARCHAR(12),
    province_name VARCHAR(64),
    city_code VARCHAR(12),
    city_name VARCHAR(64),
    district_code VARCHAR(12),
    district_name VARCHAR(64),
    detail VARCHAR(255),
    label VARCHAR(32),
    is_default BOOLEAN,
    create_time TIMESTAMP,
    update_time TIMESTAMP,
    create_user BIGINT,
    update_user BIGINT
);

CREATE TABLE shopping_cart (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(64),
    image VARCHAR(255),
    user_id BIGINT NOT NULL,
    dish_id BIGINT,
    setmeal_id BIGINT,
    dish_flavor VARCHAR(255),
    number INTEGER DEFAULT 1,
    amount DECIMAL(10, 2),
    create_time TIMESTAMP,
    update_time TIMESTAMP,
    create_user BIGINT,
    update_user BIGINT
);

CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    number VARCHAR(64) NOT NULL,
    status INTEGER NOT NULL,
    user_id BIGINT NOT NULL,
    address_book_id BIGINT,
    order_time TIMESTAMP,
    checkout_time TIMESTAMP,
    pay_method INTEGER,
    amount DECIMAL(10, 2),
    remark VARCHAR(255),
    phone VARCHAR(20),
    address VARCHAR(255),
    user_name VARCHAR(64),
    consignee VARCHAR(64),
    create_time TIMESTAMP,
    update_time TIMESTAMP,
    create_user BIGINT,
    update_user BIGINT
);

CREATE TABLE order_detail (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL,
    name VARCHAR(64),
    image VARCHAR(255),
    dish_id BIGINT,
    setmeal_id BIGINT,
    dish_flavor VARCHAR(255),
    number INTEGER,
    amount DECIMAL(10, 2),
    create_time TIMESTAMP,
    update_time TIMESTAMP,
    create_user BIGINT,
    update_user BIGINT
);

CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_address_book_user_id ON address_book(user_id);
CREATE INDEX idx_shopping_cart_user_id ON shopping_cart(user_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_order_detail_order_id ON order_detail(order_id);

