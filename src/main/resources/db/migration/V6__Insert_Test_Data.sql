-- ==================================================
-- V8: Insert EuroBite Data (DE/IT/FR) - Extended Edition
-- ==================================================

-- 1. CLEANUP OLD DATA
TRUNCATE TABLE order_detail, orders, setmeal_dish, setmeal, address_book, shopping_cart, dish_flavor, dish, category, employee, users RESTART IDENTITY CASCADE;

-- 2. INSERT EMPLOYEES
INSERT INTO employee (username, name, password, phone, sex, status, create_time, update_time) VALUES
('admin', 'System Admin', '$2a$10$7JB720yubVSOfv2O6g8weuGY0w5.YWZY5fZlKW5z5f5z5f5f5f5f5f', '+49 170 0000001', '1', 1, NOW(), NOW()),
('manager', 'Operations Manager', '$2a$10$7JB720yubVSOfv2O6g8weuGY0w5.YWZY5fZlKW5z5f5f5z5f5f5f', '+33 6 00 00 00 02', '1', 1, NOW(), NOW()),
('chef', 'Head Chef', '$2a$10$7JB720yubVSOfv2O6g8weuGY0w5.YWZY5fZlKW5z5f5f5f5f5f5f', '+39 300 0000003', '1', 1, NOW(), NOW());

-- 3. INSERT CATEGORIES
INSERT INTO category (type, name, sort, create_time, update_time) VALUES
-- Dish Categories (type = 1)
(1, 'Best Sellers', 1, NOW(), NOW()),
(1, 'Signature Mains', 2, NOW(), NOW()),
(1, 'Appetizers', 3, NOW(), NOW()),
(1, 'Soups & Salads', 4, NOW(), NOW()),
(1, 'Vegetarian', 5, NOW(), NOW()),
(1, 'Meat Lovers', 6, NOW(), NOW()),
(1, 'Seafood & Fish', 7, NOW(), NOW()),
(1, 'Pasta & Risotto', 8, NOW(), NOW()),
(1, 'Desserts', 9, NOW(), NOW()),
(1, 'Beverages', 10, NOW(), NOW()),

-- Setmeal Categories (type = 2)
(2, 'Business Lunch', 1, NOW(), NOW()),
(2, 'Dinner Sets', 2, NOW(), NOW()),
(2, 'Family Feast', 3, NOW(), NOW()),
(2, 'Couples Special', 4, NOW(), NOW());

-- 4. INSERT DISHES
INSERT INTO dish (name, category_id, price, description, status, sort, create_time, update_time) VALUES
-- Best Sellers (Cat 1)
('Pizza Margherita', 1, 12.50, 'Classic Italian pizza with tomatoes, mozzarella, and basil.', 1, 1, NOW(), NOW()),
('Wiener Schnitzel', 1, 19.50, 'Breaded veal cutlet served with lemon and potato salad.', 1, 2, NOW(), NOW()),
('Coq au Vin', 1, 22.00, 'Chicken braised with wine, lardons, and mushrooms.', 1, 3, NOW(), NOW()),
('Tiramisu', 1, 8.50, 'Coffee-flavoured Italian dessert.', 1, 4, NOW(), NOW()),

-- Signature Mains (Cat 2)
('Beef Wellington', 2, 32.00, 'Steak coated with pâté and duxelles, wrapped in puff pastry.', 1, 1, NOW(), NOW()),
('Osso Buco', 2, 28.00, 'Milanese veal shanks braised with vegetables and white wine.', 1, 2, NOW(), NOW()),
('Sauerbraten', 2, 21.50, 'Marinated pot roast, a German national dish.', 1, 3, NOW(), NOW()),
('Duck Confit', 2, 24.00, 'Slow-cooked duck legs, crispy skin and tender meat.', 1, 4, NOW(), NOW()),
('Schweinshaxe', 2, 26.50, 'Roasted pork knuckle, crispy skin, served with sauerkraut.', 1, 5, NOW(), NOW()),

-- Appetizers (Cat 3)
('Bruschetta', 3, 7.50, 'Grilled bread with garlic, tomatoes, and olive oil.', 1, 1, NOW(), NOW()),
('Escargots', 3, 12.00, 'Burgundy snails with garlic herb butter.', 1, 2, NOW(), NOW()),
('Beef Carpaccio', 3, 14.50, 'Thinly sliced raw beef with parmesan and arugula.', 1, 3, NOW(), NOW()),
('Arancini', 3, 9.00, 'Fried rice balls coated with breadcrumbs.', 1, 4, NOW(), NOW()),
('Flammkuchen', 3, 11.00, 'Alsatian thin crust pizza with crème fraîche, onions, and bacon.', 1, 5, NOW(), NOW()),
('Caprese Salad', 3, 11.50, 'Mozzarella, tomatoes, and sweet basil.', 1, 6, NOW(), NOW()),

-- Soups & Salads (Cat 4)
('French Onion Soup', 4, 9.00, 'Gratinéed with croutons and cheese.', 1, 1, NOW(), NOW()),
('Minestrone', 4, 8.00, 'Thick vegetable soup with pasta.', 1, 2, NOW(), NOW()),
('Lobster Bisque', 4, 14.00, 'Creamy soup based on strained broth of crustaceans.', 1, 3, NOW(), NOW()),
('Kartoffelsuppe', 4, 7.50, 'German potato soup with sausage.', 1, 4, NOW(), NOW()),
('Nicoise Salad', 4, 13.50, 'Salad with tuna, hard-boiled eggs, olives, and anchovies.', 1, 5, NOW(), NOW()),
('Caesar Salad', 4, 12.00, 'Romaine lettuce, croutons, parmesan, and caesar dressing.', 1, 6, NOW(), NOW()),

-- Vegetarian (Cat 5)
('Ratatouille', 5, 16.00, 'Provençal stewed vegetables.', 1, 1, NOW(), NOW()),
('Käsespätzle', 5, 14.50, 'Cheese noodles with roasted onions.', 1, 2, NOW(), NOW()),
('Eggplant Parmigiana', 5, 15.50, 'Sliced eggplant layered with cheese and tomato sauce.', 1, 3, NOW(), NOW()),
('Spinach Quiche', 5, 11.00, 'Savory pie with spinach and cheese.', 1, 4, NOW(), NOW()),

-- Meat Lovers (Cat 6)
('Steak Frites', 6, 28.00, 'Ribeye steak with french fries.', 1, 1, NOW(), NOW()),
('Currywurst', 6, 10.50, 'Sausage with curry ketchup and fries.', 1, 2, NOW(), NOW()),
('Rouladen', 6, 22.50, 'Rolled beef filled with bacon, pickles, and onions.', 1, 3, NOW(), NOW()),
('Cordon Bleu', 6, 20.00, 'Meat wrapped around cheese, then breaded and pan-fried.', 1, 4, NOW(), NOW()),
('Bratwurst Plate', 6, 15.00, 'Grilled sausages with mustard and bread.', 1, 5, NOW(), NOW()),

-- Seafood & Fish (Cat 7)
('Bouillabaisse', 7, 30.00, 'Traditional Provençal fish stew.', 1, 1, NOW(), NOW()),
('Grilled Salmon', 7, 24.00, 'With lemon butter sauce and asparagus.', 1, 2, NOW(), NOW()),
('Fritto Misto', 7, 22.00, 'Mixed fried seafood.', 1, 3, NOW(), NOW()),
('Moules Marinières', 7, 19.50, 'Mussels cooked in white wine and garlic.', 1, 4, NOW(), NOW()),

-- Pasta & Risotto (Cat 8)
('Spaghetti Carbonara', 8, 15.00, 'Pancetta, egg, and pecorino cheese.', 1, 1, NOW(), NOW()),
('Lasagna Classico', 8, 16.50, 'Layered pasta with ragu and bechamel.', 1, 2, NOW(), NOW()),
('Risotto alla Milanese', 8, 18.00, 'Saffron infused creamy rice.', 1, 3, NOW(), NOW()),
('Tagliatelle Bolognese', 8, 15.50, 'Slow cooked meat sauce.', 1, 4, NOW(), NOW()),
('Penne Arrabbiata', 8, 13.00, 'Spicy tomato sauce.', 1, 5, NOW(), NOW()),

-- Desserts (Cat 9)
('Crème Brûlée', 9, 9.50, 'Custard with caramelized sugar top.', 1, 1, NOW(), NOW()),
('Panna Cotta', 9, 8.00, 'Creamy Italian dessert with berry coulis.', 1, 2, NOW(), NOW()),
('Apple Strudel', 9, 8.50, 'Pastry with spiced apple filling.', 1, 3, NOW(), NOW()),
('Black Forest Cake', 9, 9.00, 'Chocolate, cherries, and whipped cream.', 1, 4, NOW(), NOW()),
('Profiteroles', 9, 8.50, 'Choux pastry balls filled with cream and chocolate sauce.', 1, 5, NOW(), NOW()),
('Gelato Selection', 9, 7.00, 'Three scoops of Italian ice cream.', 1, 6, NOW(), NOW()),

-- Beverages (Cat 10)
('Espresso', 10, 3.00, 'Strong black coffee.', 1, 1, NOW(), NOW()),
('Cappuccino', 10, 4.00, 'Coffee with steamed milk foam.', 1, 2, NOW(), NOW()),
('Mineral Water', 10, 2.50, 'Sparkling or Still.', 1, 3, NOW(), NOW()),
('Cola', 10, 3.50, 'Classic soft drink.', 1, 4, NOW(), NOW()),
('Draft Beer', 10, 5.00, '0.5L Lager.', 1, 5, NOW(), NOW()),
('Red Wine Glass', 10, 6.50, 'House Red.', 1, 6, NOW(), NOW()),
('White Wine Glass', 10, 6.50, 'House White.', 1, 7, NOW(), NOW());

-- 5. INSERT DISH FLAVORS
INSERT INTO dish_flavor (dish_id, name, value, create_time, update_time) VALUES
(1, 'Size', '["Medium", "Large"]', NOW(), NOW()),
(15, 'Cheese', '["Emmental", "Gruyère"]', NOW(), NOW()),
(25, 'Doneness', '["Rare", "Medium", "Well Done"]', NOW(), NOW()),
(29, 'Doneness', '["Medium", "Well Done"]', NOW(), NOW()),
(46, 'Scoops', '["Vanilla", "Chocolate", "Strawberry", "Pistachio"]', NOW(), NOW());

-- 6. INSERT USERS (Customers with European Phones)
INSERT INTO users (phone, status, create_time, update_time) VALUES
('+49 151 12345601', 1, NOW() - INTERVAL '40 days', NOW()),
('+49 151 12345602', 1, NOW() - INTERVAL '35 days', NOW()),
('+49 170 98765403', 1, NOW() - INTERVAL '30 days', NOW()),
('+49 171 55500004', 1, NOW() - INTERVAL '28 days', NOW()),
('+33 6 12 34 56 05', 1, NOW() - INTERVAL '25 days', NOW()),
('+33 6 98 76 54 06', 1, NOW() - INTERVAL '22 days', NOW()),
('+33 7 00 11 22 07', 1, NOW() - INTERVAL '20 days', NOW()),
('+39 333 1234508', 1, NOW() - INTERVAL '18 days', NOW()),
('+39 340 5678909', 1, NOW() - INTERVAL '15 days', NOW()),
('+39 320 0001110', 1, NOW() - INTERVAL '14 days', NOW()),
('+49 160 11122211', 1, NOW() - INTERVAL '12 days', NOW()),
('+33 6 55 44 33 12', 1, NOW() - INTERVAL '10 days', NOW()),
('+39 388 9998813', 1, NOW() - INTERVAL '8 days', NOW()),
('+49 172 3334414', 1, NOW() - INTERVAL '7 days', NOW()),
('+33 6 22 33 44 15', 1, NOW() - INTERVAL '6 days', NOW()),
('+39 335 6677816', 1, NOW() - INTERVAL '5 days', NOW()),
('+49 152 0000017', 1, NOW() - INTERVAL '4 days', NOW()),
('+33 6 11 22 33 18', 1, NOW() - INTERVAL '3 days', NOW()),
('+39 347 4455619', 1, NOW() - INTERVAL '2 days', NOW()),
('+49 175 6667720', 1, NOW() - INTERVAL '1 days', NOW()),
('+33 7 88 99 00 21', 1, NOW(), NOW()),
('+39 331 2233422', 1, NOW(), NOW());

-- 7. INSERT ADDRESSES
INSERT INTO address_book (user_id, consignee, sex, phone, province_code, province_name, city_code, city_name, district_code, district_name, detail, label, is_default, create_time, update_time) VALUES
(1, 'Lukas Schmidt', '1', '+49 151 12345601', '100', 'Berlin', '101', 'Berlin', '101', 'Mitte', 'Unter den Linden 5', 'Home', true, NOW(), NOW()),
(2, 'Emma Weber', '2', '+49 151 12345602', '100', 'Berlin', '101', 'Berlin', '101', 'Kreuzberg', 'Oranienstrasse 20', 'Work', true, NOW(), NOW()),
(3, 'Maximilian Mueller', '1', '+49 170 98765403', '400', 'Bavaria', '401', 'Munich', '401', 'Maxvorstadt', 'Schellingstrasse 12', 'Home', true, NOW(), NOW()),
(4, 'Sophie Wagner', '2', '+49 171 55500004', '400', 'Bavaria', '401', 'Munich', '401', 'Schwabing', 'Leopoldstrasse 45', 'Home', true, NOW(), NOW()),
(5, 'Camille Dubois', '2', '+33 6 12 34 56 05', '300', 'Ile-de-France', '301', 'Paris', '301', 'Le Marais', 'Rue de Turenne 15', 'Home', true, NOW(), NOW()),
(6, 'Gabriel Laurent', '1', '+33 6 98 76 54 06', '300', 'Ile-de-France', '301', 'Paris', '301', 'Montmartre', 'Rue Lepic 10', 'Work', true, NOW(), NOW()),
(7, 'Lea Petit', '2', '+33 7 00 11 22 07', '300', 'Ile-de-France', '301', 'Paris', '301', 'Latin Quarter', 'Rue des Ecoles 5', 'Home', true, NOW(), NOW()),
(8, 'Alessandro Ricci', '1', '+39 333 1234508', '200', 'Lazio', '201', 'Rome', '201', 'Trastevere', 'Via della Lungaretta 8', 'Home', true, NOW(), NOW()),
(9, 'Sofia Romano', '2', '+39 340 5678909', '200', 'Lazio', '201', 'Rome', '201', 'Monti', 'Via dei Serpenti 22', 'Work', true, NOW(), NOW()),
(10, 'Matteo Esposito', '1', '+39 320 0001110', '500', 'Lombardy', '501', 'Milan', '501', 'Brera', 'Via Fiori Chiari 3', 'Home', true, NOW(), NOW()),
(11, 'Hanna Fischer', '2', '+49 160 11122211', '100', 'Berlin', '101', 'Berlin', '101', 'Prenzlauer Berg', 'Kastanienallee 80', 'Home', true, NOW(), NOW()),
(12, 'Louis Martin', '1', '+33 6 55 44 33 12', '310', 'Provence', '311', 'Lyon', '311', 'Vieux Lyon', 'Rue Saint-Jean 10', 'Work', true, NOW(), NOW()),
(13, 'Giuseppe Bianchi', '1', '+39 388 9998813', '600', 'Campania', '601', 'Naples', '601', 'Centro', 'Via Toledo 100', 'Home', true, NOW(), NOW()),
(14, 'Leon Hoffman', '1', '+49 172 3334414', '700', 'Hamburg', '701', 'Hamburg', '701', 'Altona', 'Ottenser Hauptstr 20', 'Home', true, NOW(), NOW()),
(15, 'Manon Bernard', '2', '+33 6 22 33 44 15', '320', 'Riviera', '321', 'Nice', '321', 'Promenade', 'Promenade des Anglais 50', 'Home', true, NOW(), NOW()),
(16, 'Francesca Conti', '2', '+39 335 6677816', '700', 'Tuscany', '701', 'Florence', '701', 'Duomo', 'Piazza del Duomo 1', 'Work', true, NOW(), NOW()),
(17, 'Paul Becker', '1', '+49 152 0000017', '100', 'Berlin', '101', 'Berlin', '101', 'Friedrichshain', 'Simon-Dach-Strasse 12', 'Home', true, NOW(), NOW()),
(18, 'Chloe Thomas', '2', '+33 6 11 22 33 18', '300', 'Ile-de-France', '301', 'Paris', '301', 'Bastille', 'Rue de la Roquette 25', 'Home', true, NOW(), NOW()),
(19, 'Lorenzo Costa', '1', '+39 347 4455619', '800', 'Veneto', '801', 'Venice', '801', 'San Marco', 'Calle Larga 22', 'Home', true, NOW(), NOW()),
(20, 'Felix Koch', '1', '+49 175 6667720', '400', 'Bavaria', '401', 'Munich', '401', 'Glockenbach', 'Muellerstrasse 10', 'Work', true, NOW(), NOW());

-- 8. INSERT SETMEALS
INSERT INTO setmeal (category_id, name, price, description, status, create_time, update_time) VALUES
-- Business Lunch (Cat 11)
(11, 'Schnitzel Express', 22.00, 'Wiener Schnitzel + Drink.', 1, NOW(), NOW()),
(11, 'Pasta Deal', 18.00, 'Pasta of choice + Salad.', 1, NOW(), NOW()),
-- Dinner Sets (Cat 12)
(12, 'French Evening', 35.00, 'Onion Soup, Coq au Vin, Crème Brûlée.', 1, NOW(), NOW()),
(12, 'Italian Night', 32.00, 'Bruschetta, Lasagna, Tiramisu.', 1, NOW(), NOW()),
-- Family Feast (Cat 13)
(13, 'Family Pizza Party', 50.00, '4 Pizzas + 4 Drinks.', 1, NOW(), NOW()),
(13, 'Sunday Roast', 65.00, 'Whole Roast Chicken + Sides.', 1, NOW(), NOW());

-- 9. INSERT SETMEAL-DISH RELATIONS
INSERT INTO setmeal_dish (setmeal_id, dish_id, name, price, copies, sort, create_time, update_time) VALUES
-- Schnitzel Express (ID 1)
(1, 2, 'Wiener Schnitzel', 19.50, 1, 1, NOW(), NOW()),
(1, 51, 'Cola', 3.50, 1, 2, NOW(), NOW()),
-- French Evening (ID 3)
(3, 15, 'French Onion Soup', 9.00, 1, 1, NOW(), NOW()),
(3, 3, 'Coq au Vin', 22.00, 1, 2, NOW(), NOW()),
(3, 41, 'Crème Brûlée', 9.50, 1, 3, NOW(), NOW());

-- 10. INSERT ORDERS (Sample of 30 orders for brevity but diversity)
INSERT INTO orders (number, status, user_id, order_time, checkout_time, pay_method, amount, remark, phone, address, user_name, consignee, create_time, update_time) VALUES
('ORD-001', 4, 1, NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days 1 hour', 1, 25.50, '', '+49 151 12345601', 'Unter den Linden 5', 'Lukas Schmidt', 'Lukas Schmidt', NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'),
('ORD-002', 4, 5, NOW() - INTERVAL '19 days', NOW() - INTERVAL '19 days 1 hour', 2, 45.00, '', '+33 6 12 34 56 05', 'Rue de Turenne 15', 'Camille Dubois', 'Camille Dubois', NOW() - INTERVAL '19 days', NOW() - INTERVAL '19 days'),
('ORD-003', 4, 8, NOW() - INTERVAL '18 days', NOW() - INTERVAL '18 days 1 hour', 1, 32.00, '', '+39 333 1234508', 'Via della Lungaretta 8', 'Alessandro Ricci', 'Alessandro Ricci', NOW() - INTERVAL '18 days', NOW() - INTERVAL '18 days'),
('ORD-004', 4, 2, NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days 1 hour', 1, 18.00, 'Lunch break', '+49 151 12345602', 'Oranienstrasse 20', 'Emma Weber', 'Emma Weber', NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days'),
('ORD-005', 4, 12, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days 1 hour', 2, 55.00, '', '+33 6 55 44 33 12', 'Rue Saint-Jean 10', 'Louis Martin', 'Louis Martin', NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
('ORD-006', 4, 20, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days 1 hour', 1, 22.50, '', '+49 175 6667720', 'Muellerstrasse 10', 'Felix Koch', 'Felix Koch', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
('ORD-007', 3, 3, NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '20 minutes', 1, 40.00, 'Extra cutlery', '+49 170 98765403', 'Schellingstrasse 12', 'Maximilian Mueller', 'Maximilian Mueller', NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '30 minutes'),
('ORD-008', 2, 6, NOW() - INTERVAL '10 minutes', NULL, 1, 15.00, '', '+33 6 98 76 54 06', 'Rue Lepic 10', 'Gabriel Laurent', 'Gabriel Laurent', NOW() - INTERVAL '10 minutes', NOW() - INTERVAL '10 minutes'),
('ORD-009', 2, 10, NOW() - INTERVAL '5 minutes', NULL, 2, 60.00, 'Birthday dinner', '+39 320 0001110', 'Via Fiori Chiari 3', 'Matteo Esposito', 'Matteo Esposito', NOW() - INTERVAL '5 minutes', NOW() - INTERVAL '5 minutes'),
('ORD-010', 4, 4, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days 1 hour', 1, 28.00, '', '+49 171 55500004', 'Leopoldstrasse 45', 'Sophie Wagner', 'Sophie Wagner', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days');

-- 11. INSERT ORDER DETAILS
INSERT INTO order_detail (order_id, name, image, dish_id, number, amount, create_time, update_time) VALUES
(1, 'Pizza Margherita', NULL, 1, 2, 25.00, NOW() - INTERVAL '20 days', NOW()),
(2, 'Coq au Vin', NULL, 3, 1, 22.00, NOW() - INTERVAL '19 days', NOW()),
(2, 'French Onion Soup', NULL, 15, 2, 18.00, NOW() - INTERVAL '19 days', NOW()),
(3, 'Osso Buco', NULL, 6, 1, 28.00, NOW() - INTERVAL '18 days', NOW()),
(3, 'Espresso', NULL, 47, 1, 3.00, NOW() - INTERVAL '18 days', NOW());

-- Update Sequences
SELECT setval('employee_id_seq', (SELECT MAX(id) FROM employee));
SELECT setval('category_id_seq', (SELECT MAX(id) FROM category));
SELECT setval('dish_id_seq', (SELECT MAX(id) FROM dish));
SELECT setval('dish_flavor_id_seq', (SELECT MAX(id) FROM dish_flavor));
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('address_book_id_seq', (SELECT MAX(id) FROM address_book));
SELECT setval('setmeal_id_seq', (SELECT MAX(id) FROM setmeal));
SELECT setval('setmeal_dish_id_seq', (SELECT MAX(id) FROM setmeal_dish));
SELECT setval('orders_id_seq', (SELECT MAX(id) FROM orders));
SELECT setval('order_detail_id_seq', (SELECT MAX(id) FROM order_detail));

SELECT 'EuroBite Extended Data Inserted Successfully!' as message;