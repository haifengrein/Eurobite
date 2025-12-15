-- Create system_config table
CREATE TABLE system_config (
    id BIGSERIAL PRIMARY KEY,
    variable VARCHAR(100) NOT NULL UNIQUE,
    value VARCHAR(500),
    description VARCHAR(200),
    create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    create_user BIGINT,
    update_user BIGINT
);

-- Create index for variable
CREATE INDEX idx_system_config_variable ON system_config(variable);

-- Insert default system configuration
INSERT INTO system_config (variable, value, description) VALUES
('shop.name', 'EuroBite', 'Shop name displayed in the system'),
('shop.address', '', 'Shop address'),
('shop.phone', '', 'Shop phone number'),
('shop.email', '', 'Shop email address'),
('shop.status', '1', 'Shop open status: 0=closed, 1=open'),
('order.auto.confirm.minutes', '15', 'Auto confirm order after X minutes'),
('delivery.fee', '5.00', 'Default delivery fee'),
('min.order.amount', '20.00', 'Minimum order amount for delivery');
