-- ==================================================
-- V6: 插入测试数据 (Test Data for C-End Business)
-- ==================================================

-- 1. 插入员工数据 (Admin Users)
INSERT INTO employee (username, name, password, phone, sex, status, create_time, update_time) VALUES
('admin', '系统管理员', '$2a$10$7JB720yubVSOfv2O6g8weuGY0w5.YWZY5fZlKW5z5f5z5f5f5f5f5f', '13800138001', '1', 1, NOW(), NOW()),
('manager', '运营经理', '$2a$10$7JB720yubVSOfv2O6g8weuGY0w5.YWZY5fZlKW5z5f5f5z5f5f5f', '13800138002', '1', 1, NOW(), NOW()),
('chef', '厨师长', '$2a$10$7JB720yubVSOfv2O6g8weuGY0w5.YWZY5fZlKW5z5f5f5f5f5f5f', '13800138003', '1', 1, NOW(), NOW());

-- 2. 插入分类数据 (Dish Categories)
INSERT INTO category (type, name, sort, create_time, update_time) VALUES
-- 菜品分类 (type = 1)
(1, '热销菜品', 1, NOW(), NOW()),
(1, '招牌主食', 2, NOW(), NOW()),
(1, '精美小食', 3, NOW(), NOW()),
(1, '汤羹类', 4, NOW(), NOW()),
(1, '素食主义', 5, NOW(), NOW()),
(1, '肉食天堂', 6, NOW(), NOW()),
(1, '饮品甜点', 7, NOW(), NOW()),

-- 套餐分类 (type = 2)
(2, '商务套餐', 1, NOW(), NOW()),
(2, '单人套餐', 2, NOW(), NOW()),
(2, '双人套餐', 3, NOW(), NOW()),
(2, '家庭套餐', 4, NOW(), NOW()),
(2, '营养搭配', 5, NOW(), NOW());

-- 3. 插入菜品数据 (Dishes)
INSERT INTO dish (name, category_id, price, description, status, sort, create_time, update_time) VALUES
-- 热销菜品
('宫保鸡丁', 1, 28.80, '经典川菜，鸡肉嫩滑，花生酥脆，酸甜微辣', 1, 1, NOW(), NOW()),
('麻婆豆腐', 1, 18.80, '四川传统名菜，豆腐嫩滑，麻辣鲜香', 1, 2, NOW(), NOW()),
('水煮鱼', 1, 58.80, '川菜经典，鱼片嫩滑，麻辣过瘾', 1, 3, NOW(), NOW()),
('回锅肉', 1, 32.80, '川菜之王，肥瘦相间，香辣下饭', 1, 4, NOW(), NOW()),

-- 招牌主食
('蛋炒饭', 2, 15.80, '粒粒分明，配菜丰富，香气扑鼻', 1, 1, NOW(), NOW()),
('牛肉面', 2, 26.80, '手工拉面，牛肉鲜美，汤汁浓郁', 1, 2, NOW(), NOW()),
('扬州炒饭', 2, 22.80, '经典炒饭，虾仁火腿，色香味俱全', 1, 3, NOW(), NOW()),
('红烧牛肉面', 2, 28.80, '浓郁汤底，牛肉软烂，面条劲道', 1, 4, NOW(), NOW()),

-- 精美小食
('小笼包', 3, 16.80, '皮薄馅大，汤汁鲜美，上海特色', 1, 1, NOW(), NOW()),
('春卷', 3, 12.80, '酥脆可口，馅料丰富', 1, 2, NOW(), NOW()),
('蒸饺', 3, 18.80, '手工制作，皮薄馅足', 1, 3, NOW(), NOW()),
('煎饺', 3, 18.80, '底部金黄，外酥内嫩', 1, 4, NOW(), NOW()),

-- 汤羹类
('紫菜蛋花汤', 4, 12.80, '清淡鲜美，营养丰富', 1, 1, NOW(), NOW()),
('冬瓜排骨汤', 4, 28.80, '清淡解腻，滋补养颜', 1, 2, NOW(), NOW()),
('西红柿鸡蛋汤', 4, 15.80, '酸甜开胃，营养均衡', 1, 3, NOW(), NOW()),
('酸辣汤', 4, 18.80, '酸辣开胃，暖胃驱寒', 1, 4, NOW(), NOW()),

-- 素食主义
('清炒时蔬', 5, 16.80, '新鲜时令蔬菜，清淡健康', 1, 1, NOW(), NOW()),
('麻婆豆腐(素)', 5, 16.80, '素食版本，同样美味', 1, 2, NOW(), NOW()),
('干煸四季豆', 5, 20.80, '四季豆脆嫩，干香微辣', 1, 3, NOW(), NOW()),
('蒜蓉西兰花', 5, 18.80, '清淡爽口，营养丰富', 1, 4, NOW(), NOW()),

-- 肉食天堂
('红烧肉', 6, 38.80, '肥瘦相间，软糯香甜', 1, 1, NOW(), NOW()),
('糖醋里脊', 6, 32.80, '酸甜可口，外酥内嫩', 1, 2, NOW(), NOW()),
('可乐鸡翅', 6, 26.80, '甜香嫩滑，老少皆宜', 1, 3, NOW(), NOW()),
('红烧排骨', 6, 36.80, '排骨软烂，色泽红亮', 1, 4, NOW(), NOW()),

-- 饮品甜点
('珍珠奶茶', 7, 18.80, '香浓奶茶配Q弹珍珠', 1, 1, NOW(), NOW()),
('红豆冰', 7, 16.80, '夏日消暑，甜而不腻', 1, 2, NOW(), NOW()),
('芒果布丁', 7, 20.80, '嫩滑香甜，芒果味浓', 1, 3, NOW(), NOW()),
('银耳莲子汤', 7, 15.80, '滋阴润燥，清热降火', 1, 4, NOW(), NOW());

-- 4. 插入菜品口味数据 (Dish Flavors)
INSERT INTO dish_flavor (dish_id, name, value, create_time, update_time) VALUES
-- 宫保鸡丁口味
(1, '辣度', '["微辣","中辣","重辣"]', NOW(), NOW()),
(1, '口味偏好', '["经典","少糖","多醋"]', NOW(), NOW()),

-- 麻婆豆腐口味
(2, '辣度', '["微辣","中辣","重辣"]', NOW(), NOW()),
(2, '口感', '["嫩滑","Q弹"]', NOW(), NOW()),

-- 水煮鱼口味
(3, '辣度', '["中辣","重辣","超辣"]', NOW(), NOW()),
(3, '鱼片厚度', '["薄片","厚片"]', NOW(), NOW()),

-- 小笼包口味
(9, '肉馅', '["猪肉","虾仁","蟹黄"]', NOW(), NOW()),
(9, '汤汁', '["清淡","正常","浓郁"]', NOW(), NOW()),

-- 珍珠奶茶口味
(25, '甜度', '["无糖","微糖","半糖","正常","多糖"]', NOW(), NOW()),
(25, '珍珠', '["正常","少珍珠","多珍珠","加布丁"]', NOW(), NOW());

-- 5. 插入用户数据 (Customers)
INSERT INTO users (phone, status, create_time, update_time) VALUES
('13900000001', 1, NOW() - INTERVAL '30 days', NOW()),
('13900000002', 1, NOW() - INTERVAL '25 days', NOW()),
('13900000003', 1, NOW() - INTERVAL '20 days', NOW()),
('13900000004', 1, NOW() - INTERVAL '18 days', NOW()),
('13900000005', 1, NOW() - INTERVAL '15 days', NOW()),
('13900000006', 1, NOW() - INTERVAL '12 days', NOW()),
('13900000007', 1, NOW() - INTERVAL '10 days', NOW()),
('13900000008', 1, NOW() - INTERVAL '8 days', NOW()),
('13900000009', 1, NOW() - INTERVAL '5 days', NOW()),
('13900000010', 1, NOW() - INTERVAL '3 days', NOW()),
('13900000011', 1, NOW() - INTERVAL '2 days', NOW()),
('13900000012', 1, NOW() - INTERVAL '1 days', NOW()),
('13900000013', 1, NOW(), NOW()),
('13900000014', 1, NOW() - INTERVAL '6 hours', NOW()),
('13900000015', 1, NOW() - INTERVAL '2 hours', NOW());

-- 6. 插入地址数据 (User Addresses)
INSERT INTO address_book (user_id, consignee, sex, phone, province_code, province_name, city_code, city_name, district_code, district_name, detail, label, is_default, create_time, update_time) VALUES
-- 为前5个用户添加默认地址
(1, '张三', '1', '13900000001', '11', '北京市', '1101', '市辖区', '1101', '朝阳区', '朝阳门外大街1号', '家', true, NOW() - INTERVAL '30 days', NOW()),
(2, '李四', '2', '13900000002', '31', '上海市', '3101', '市辖区', '3101', '黄浦区', '南京东路2号', '公司', true, NOW() - INTERVAL '25 days', NOW()),
(3, '王五', '1', '13900000003', '44', '广东省', '4403', '深圳市', '4403', '南山区', '深南大道3号', '家', true, NOW() - INTERVAL '20 days', NOW()),
(4, '赵六', '2', '13900000004', '33', '浙江省', '3301', '杭州市', '3301', '西湖区', '文三路4号', '公司', true, NOW() - INTERVAL '18 days', NOW()),
(5, '钱七', '1', '13900000005', '57', '甘肃省', '5701', '兰州市', '5701', '城关区', '东方红广场5号', '家', true, NOW() - INTERVAL '15 days', NOW());

-- 7. 插入套餐数据 (Setmeals)
INSERT INTO setmeal (category_id, name, price, description, status, create_time, update_time) VALUES
-- 商务套餐
(8, '商务午餐A', 38.80, '两荤一素一汤，营养均衡', 1, NOW(), NOW()),
(8, '商务午餐B', 42.80, '三荤两素一汤，商务首选', 1, NOW(), NOW()),
(8, '商务午餐C', 48.80, '四荤两素一汤，丰盛套餐', 1, NOW(), NOW()),

-- 单人套餐
(9, '单人经济餐', 26.80, '一荤一素一汤，实惠选择', 1, NOW(), NOW()),
(9, '单人豪华餐', 36.80, '两荤一素一汤，品质保证', 1, NOW(), NOW()),

-- 双人套餐
(10, '双人分享餐', 68.80, '两荤两素一汤，适合两人', 1, NOW(), NOW()),
(10, '双人浪漫餐', 88.80, '三荤两素一汤，浪漫约会', 1, NOW(), NOW()),

-- 家庭套餐
(11, '三人家庭餐', 98.80, '三荤三素一汤，温馨家庭', 1, NOW(), NOW()),
(11, '四人家庭餐', 128.80, '四荤三素一汤，家人共享', 1, NOW(), NOW()),

-- 营养搭配
(12, '营养均衡餐', 45.80, '科学搭配，营养全面', 1, NOW(), NOW()),
(12, '低脂健康餐', 42.80, '低脂高蛋白，健康之选', 1, NOW(), NOW());

-- 8. 插入套餐菜品关联数据 (Setmeal-Dish Relations)
INSERT INTO setmeal_dish (setmeal_id, dish_id, name, price, copies, sort, create_time, update_time) VALUES
-- 商务午餐A套餐内容
(1, 1, '宫保鸡丁', 28.80, 1, 1, NOW(), NOW()),
(1, 7, '蛋炒饭', 15.80, 1, 2, NOW(), NOW()),
(1, 15, '紫菜蛋花汤', 12.80, 1, 3, NOW(), NOW()),

-- 商务午餐B套餐内容
(2, 3, '水煮鱼', 58.80, 1, 1, NOW(), NOW()),
(2, 6, '牛肉面', 26.80, 1, 2, NOW(), NOW()),
(2, 19, '蒜蓉西兰花', 18.80, 1, 3, NOW(), NOW()),
(2, 14, '西红柿鸡蛋汤', 15.80, 1, 4, NOW(), NOW()),

-- 单人经济餐套餐内容
(4, 2, '麻婆豆腐', 18.80, 1, 1, NOW(), NOW()),
(4, 17, '干煸四季豆', 20.80, 1, 2, NOW(), NOW()),
(4, 13, '冬瓜排骨汤', 28.80, 1, 3, NOW(), NOW()),

-- 双人分享餐套餐内容
(6, 5, '回锅肉', 32.80, 1, 1, NOW(), NOW()),
(6, 21, '红烧肉', 38.80, 1, 2, NOW(), NOW()),
(6, 6, '牛肉面', 26.80, 2, 3, NOW(), NOW()),
(6, 17, '干煸四季豆', 20.80, 1, 4, NOW(), NOW()),

-- 三人家庭餐套餐内容
(8, 21, '红烧肉', 38.80, 1, 1, NOW(), NOW()),
(8, 5, '回锅肉', 32.80, 1, 2, NOW(), NOW()),
(8, 22, '糖醋里脊', 32.80, 1, 3, NOW(), NOW()),
(8, 7, '蛋炒饭', 15.80, 3, 4, NOW(), NOW()),
(8, 15, '紫菜蛋花汤', 12.80, 1, 5, NOW(), NOW());

-- 9. 插入订单数据 (Orders)
-- 最近30天的订单
INSERT INTO orders (number, status, user_id, order_time, checkout_time, pay_method, amount, remark, phone, address, user_name, consignee, create_time, update_time) VALUES
-- 已完成订单
('202412090001', 4, 1, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '90 minutes', 1, 56.80, '不要香菜', '13900000001', '朝阳门外大街1号', '张三', '张三', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '90 minutes'),
('202412090002', 4, 2, NOW() - INTERVAL '3 hours', NOW() - INTERVAL '2 hours', 2, 68.80, '', '13900000002', '南京东路2号', '李四', '李四', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '2 hours'),
('202412090003', 4, 3, NOW() - INTERVAL '4 hours', NOW() - INTERVAL '3 hours', 1, 88.80, '微辣', '13900000003', '深南大道3号', '王五', '王五', NOW() - INTERVAL '4 hours', NOW() - INTERVAL '3 hours'),
('202412080001', 4, 4, NOW() - INTERVAL '1 days', NOW() - INTERVAL '20 hours', 1, 45.80, '', '13900000004', '文三路4号', '赵六', '赵六', NOW() - INTERVAL '1 days', NOW() - INTERVAL '20 hours'),
('202412080002', 4, 5, NOW() - INTERVAL '1 days 2 hours', NOW() - INTERVAL '21 hours', 2, 128.80, '多要米饭', '13900000005', '东方红广场5号', '钱七', '钱七', NOW() - INTERVAL '1 days 2 hours', NOW() - INTERVAL '21 hours'),

-- 制作中订单
('202412090004', 3, 6, NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '25 minutes', 1, 36.80, '', '13900000006', '西二旗大街6号', '孙八', '孙八', NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '25 minutes'),
('202412090005', 3, 7, NOW() - INTERVAL '20 minutes', NOW() - INTERVAL '15 minutes', 1, 58.80, '不要辣椒', '13900000007', '中关村大街7号', '周九', '周九', NOW() - INTERVAL '20 minutes', NOW() - INTERVAL '15 minutes'),

-- 已付款待制作订单
('202412090006', 2, 8, NOW() - INTERVAL '10 minutes', NOW() - INTERVAL '8 minutes', 1, 42.80, '', '13900000008', '三里屯路8号', '吴十', '吴十', NOW() - INTERVAL '10 minutes', NOW() - INTERVAL '8 minutes'),
('202412090007', 2, 9, NOW() - INTERVAL '5 minutes', NOW() - INTERVAL '3 minutes', 2, 68.80, '快一点', '13900000009', '工体北路9号', '郑十一', '郑十一', NOW() - INTERVAL '5 minutes', NOW() - INTERVAL '3 minutes'),

-- 历史上的部分订单
('202412070001', 4, 1, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days 2 hours', 1, 38.80, '', '13900000001', '朝阳门外大街1号', '张三', '张三', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days 2 hours'),
('202412070002', 4, 2, NOW() - INTERVAL '2 days 1 hour', NOW() - INTERVAL '2 days 3 hours', 1, 48.80, '', '13900000002', '南京东路2号', '李四', '李四', NOW() - INTERVAL '2 days 1 hour', NOW() - INTERVAL '2 days 3 hours'),
('202412060001', 4, 3, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days 1 hour', 2, 88.80, '', '13900000003', '深南大道3号', '王五', '王五', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days 1 hour'),
('202412050001', 4, 4, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days 2 hours', 1, 36.80, '', '13900000004', '文三路4号', '赵六', '赵六', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days 2 hours'),
('202412040001', 4, 5, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days 1 hour', 1, 128.80, '', '13900000005', '东方红广场5号', '钱七', '钱七', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days 1 hour');

-- 10. 插入订单详情数据 (Order Details)
-- 订单202412090001的详情 (56.80元)
INSERT INTO order_detail (order_id, name, image, dish_id, number, amount, create_time, update_time) VALUES
(1, '宫保鸡丁', NULL, 1, 1, 28.80, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '90 minutes'),
(1, '蛋炒饭', NULL, 7, 1, 15.80, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '90 minutes'),
(1, '紫菜蛋花汤', NULL, 15, 1, 12.80, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '90 minutes'),

-- 订单202412090002的详情 (68.80元)
(2, '双人分享餐', NULL, NULL, 1, 68.80, NOW() - INTERVAL '3 hours', NOW() - INTERVAL '2 hours'),

-- 订单202412090003的详情 (88.80元)
(3, '双人浪漫餐', NULL, NULL, 1, 88.80, NOW() - INTERVAL '4 hours', NOW() - INTERVAL '3 hours'),

-- 订单202412080001的详情 (45.80元)
(4, '营养均衡餐', NULL, NULL, 1, 45.80, NOW() - INTERVAL '1 days', NOW() - INTERVAL '20 hours'),

-- 订单202412080002的详情 (128.80元)
(5, '四人家庭餐', NULL, NULL, 1, 128.80, NOW() - INTERVAL '1 days 2 hours', NOW() - INTERVAL '21 hours'),

-- 订单202412090004的详情 (36.80元)
(6, '单人豪华餐', NULL, NULL, 1, 36.80, NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '25 minutes'),

-- 订单202412090005的详情 (58.80元)
(7, '水煮鱼', NULL, 3, 1, 58.80, NOW() - INTERVAL '20 minutes', NOW() - INTERVAL '15 minutes'),

-- 订单202412090006的详情 (42.80元)
(8, '商务午餐B', NULL, NULL, 1, 42.80, NOW() - INTERVAL '10 minutes', NOW() - INTERVAL '8 minutes'),

-- 订单202412090007的详情 (68.80元)
(9, '双人分享餐', NULL, NULL, 1, 68.80, NOW() - INTERVAL '5 minutes', NOW() - INTERVAL '3 minutes');

-- 更新序列值
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

-- 输出统计信息
SELECT 'Test Data Inserted Successfully!' as message;
SELECT 'Employee count: ' || COUNT(*) as employee_count FROM employee;
SELECT 'Category count: ' || COUNT(*) as category_count FROM category;
SELECT 'Dish count: ' || COUNT(*) as dish_count FROM dish;
SELECT 'Dish flavor count: ' || COUNT(*) as dish_flavor_count FROM dish_flavor;
SELECT 'User count: ' || COUNT(*) as user_count FROM users;
SELECT 'Address count: ' || COUNT(*) as address_count FROM address_book;
SELECT 'Setmeal count: ' || COUNT(*) as setmeal_count FROM setmeal;
SELECT 'Setmeal dish count: ' || COUNT(*) as setmeal_dish_count FROM setmeal_dish;
SELECT 'Order count: ' || COUNT(*) as order_count FROM orders;
SELECT 'Order detail count: ' || COUNT(*) as order_detail_count FROM order_detail;