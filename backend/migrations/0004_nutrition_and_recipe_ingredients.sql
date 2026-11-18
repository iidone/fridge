ALTER TABLE recipes
    ADD COLUMN IF NOT EXISTS protein_g DOUBLE PRECISION NOT NULL DEFAULT 0 CHECK (protein_g >= 0),
    ADD COLUMN IF NOT EXISTS fat_g DOUBLE PRECISION NOT NULL DEFAULT 0 CHECK (fat_g >= 0),
    ADD COLUMN IF NOT EXISTS carbs_g DOUBLE PRECISION NOT NULL DEFAULT 0 CHECK (carbs_g >= 0);

ALTER TABLE products
    ADD COLUMN IF NOT EXISTS calories_per_100g DOUBLE PRECISION NOT NULL DEFAULT 0 CHECK (calories_per_100g >= 0),
    ADD COLUMN IF NOT EXISTS protein_g_per_100g DOUBLE PRECISION NOT NULL DEFAULT 0 CHECK (protein_g_per_100g >= 0),
    ADD COLUMN IF NOT EXISTS fat_g_per_100g DOUBLE PRECISION NOT NULL DEFAULT 0 CHECK (fat_g_per_100g >= 0),
    ADD COLUMN IF NOT EXISTS carbs_g_per_100g DOUBLE PRECISION NOT NULL DEFAULT 0 CHECK (carbs_g_per_100g >= 0);

UPDATE products
SET
    calories_per_100g = nutrition.calories,
    protein_g_per_100g = nutrition.protein,
    fat_g_per_100g = nutrition.fat,
    carbs_g_per_100g = nutrition.carbs
FROM (VALUES
    ('Куриная грудка', 110.0, 23.0, 2.0, 0.0),
    ('Гречка', 343.0, 13.6, 3.4, 71.5),
    ('Томаты черри', 18.0, 0.9, 0.2, 3.9),
    ('Огурцы', 15.0, 0.7, 0.1, 3.6),
    ('Чечевица', 352.0, 24.6, 1.1, 63.4),
    ('Морковь', 41.0, 0.9, 0.2, 9.6),
    ('Лук', 40.0, 1.1, 0.1, 9.3),
    ('Свежая зелень', 25.0, 2.5, 0.5, 3.0),
    ('Яйца', 143.0, 12.6, 9.5, 0.7),
    ('Филе хека', 89.0, 16.6, 2.2, 0.0),
    ('Рис', 344.0, 6.7, 0.7, 78.9),
    ('Лимон', 29.0, 1.1, 0.3, 9.3)
) AS nutrition(name, calories, protein, fat, carbs)
WHERE products.name = nutrition.name;

UPDATE recipes
SET protein_g = nutrition.protein,
    fat_g = nutrition.fat,
    carbs_g = nutrition.carbs
FROM (VALUES
    ('Курица с гречкой', 45.0, 10.0, 38.0),
    ('Чечевичный суп', 22.0, 8.0, 50.0),
    ('Омлет с овощами', 24.0, 27.0, 12.0),
    ('Рыба с рисом', 37.0, 10.0, 55.0)
) AS nutrition(title, protein, fat, carbs)
WHERE recipes.title = nutrition.title;

INSERT INTO recipe_ingredients (
    recipe_id, product_id, name, amount, amount_value, unit, estimated_price_rub, sort_order
)
SELECT recipes.id, products.id, products.name, ingredient.amount, ingredient.amount_value,
       ingredient.unit, ingredient.estimated_price_rub, ingredient.sort_order
FROM (VALUES
    ('Курица с гречкой', 'Куриная грудка', '180 г', 180.0, 'г', 101, 1),
    ('Курица с гречкой', 'Гречка', '70 г', 70.0, 'г', 8, 2),
    ('Курица с гречкой', 'Томаты черри', '100 г', 100.0, 'г', 36, 3),
    ('Курица с гречкой', 'Огурцы', '100 г', 100.0, 'г', 24, 4),
    ('Чечевичный суп', 'Чечевица', '80 г', 80.0, 'г', 16, 1),
    ('Чечевичный суп', 'Морковь', '80 г', 80.0, 'г', 7, 2),
    ('Чечевичный суп', 'Лук', '1/2 шт.', 0.5, 'шт.', 11, 3),
    ('Чечевичный суп', 'Свежая зелень', '1 пучок', 1.0, 'шт.', 65, 4),
    ('Омлет с овощами', 'Яйца', '3 шт.', 3.0, 'шт.', 42, 1),
    ('Омлет с овощами', 'Томаты черри', '100 г', 100.0, 'г', 36, 2),
    ('Омлет с овощами', 'Свежая зелень', '1 пучок', 1.0, 'шт.', 65, 3),
    ('Рыба с рисом', 'Филе хека', '180 г', 180.0, 'г', 117, 1),
    ('Рыба с рисом', 'Рис', '70 г', 70.0, 'г', 10, 2),
    ('Рыба с рисом', 'Лимон', '1/2 шт.', 0.5, 'шт.', 33, 3)
) AS ingredient(recipe_title, product_name, amount, amount_value, unit, estimated_price_rub, sort_order)
JOIN recipes ON recipes.title = ingredient.recipe_title
JOIN products ON products.name = ingredient.product_name
WHERE NOT EXISTS (
    SELECT 1
    FROM recipe_ingredients existing
    WHERE existing.recipe_id = recipes.id AND existing.product_id = products.id
);
