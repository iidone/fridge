ALTER TABLE products
    ADD COLUMN IF NOT EXISTS package_size DOUBLE PRECISION NOT NULL DEFAULT 1 CHECK (package_size > 0),
    ADD COLUMN IF NOT EXISTS package_price_rub INTEGER NOT NULL DEFAULT 0 CHECK (package_price_rub >= 0);

ALTER TABLE recipe_ingredients
    ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS amount_value DOUBLE PRECISION,
    ADD COLUMN IF NOT EXISTS unit TEXT;

INSERT INTO products (name, unit, package_size, package_price_rub)
VALUES
    ('Куриная грудка', 'г', 500, 280),
    ('Гречка', 'г', 800, 95),
    ('Томаты черри', 'г', 500, 180),
    ('Огурцы', 'г', 500, 120),
    ('Чечевица', 'г', 800, 160),
    ('Морковь', 'г', 1000, 90),
    ('Лук', 'шт.', 5, 110),
    ('Свежая зелень', 'шт.', 1, 65),
    ('Яйца', 'шт.', 10, 140),
    ('Филе хека', 'г', 600, 390),
    ('Рис', 'г', 800, 110),
    ('Лимон', 'шт.', 2, 130)
ON CONFLICT (name) DO UPDATE SET
    unit = EXCLUDED.unit,
    package_size = EXCLUDED.package_size,
    package_price_rub = EXCLUDED.package_price_rub;

INSERT INTO recipes (title, description, meal_type, emoji, calories, cooking_minutes, servings, estimated_price_rub)
SELECT seed.title, seed.description, seed.meal_type, seed.emoji, seed.calories, seed.cooking_minutes, 1, seed.estimated_price_rub
FROM (VALUES
    ('Курица с гречкой', 'и овощным салатом', 'Обед', '🥗', 430, 25, 340),
    ('Чечевичный суп', 'с овощами и зеленью', 'Обед', '🍲', 360, 35, 220),
    ('Омлет с овощами', 'и свежей зеленью', 'Завтрак', '🍳', 390, 15, 250),
    ('Рыба с рисом', 'и лимонной заправкой', 'Ужин', '🐟', 470, 30, 390)
) AS seed(title, description, meal_type, emoji, calories, cooking_minutes, estimated_price_rub)
WHERE NOT EXISTS (SELECT 1 FROM recipes existing WHERE existing.title = seed.title);
