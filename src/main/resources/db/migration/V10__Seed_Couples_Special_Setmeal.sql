-- Seed missing setmeal for the 'Couples Special' category (type=2)
-- Ensures each setmeal category has at least one setmeal in the demo dataset.

WITH cc AS (
    SELECT id AS category_id
    FROM category
    WHERE type = 2 AND name = 'Couples Special'
    LIMIT 1
),
ins AS (
    INSERT INTO setmeal (category_id, name, price, description, status, create_time, update_time)
    SELECT
        cc.category_id,
        'Couples Special',
        39.00,
        'Two-person set: Pizza Margherita + Tiramisu.',
        1,
        NOW(),
        NOW()
    FROM cc
    WHERE NOT EXISTS (SELECT 1 FROM setmeal s WHERE s.category_id = cc.category_id)
      AND NOT EXISTS (SELECT 1 FROM setmeal s WHERE s.name = 'Couples Special')
    RETURNING id
),
dish_rows AS (
    SELECT
        d.id AS dish_id,
        d.name,
        d.price,
        CASE d.name
            WHEN 'Pizza Margherita' THEN 1
            WHEN 'Tiramisu' THEN 2
            ELSE 99
        END AS sort
    FROM dish d
    WHERE d.name IN ('Pizza Margherita', 'Tiramisu')
)
INSERT INTO setmeal_dish (setmeal_id, dish_id, name, price, copies, sort, create_time, update_time)
SELECT
    ins.id,
    dish_rows.dish_id,
    dish_rows.name,
    dish_rows.price,
    1,
    dish_rows.sort,
    NOW(),
    NOW()
FROM ins
JOIN dish_rows ON TRUE;
