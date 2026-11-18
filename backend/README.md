# Food planner API

REST API на Rust, Axum, Tokio, SQLx и PostgreSQL. Все обращения к PostgreSQL выполняются через асинхронный `PgPool`, а миграции применяются автоматически при старте.

## Структура backend

```text
src/
  api/
    dto/                 JSON-схемы запросов и ответов
    handlers/            HTTP-обработчики Axum
  auth/                  пароли, JWT, Refresh-токены и AuthUser extractor
  infrastructure/
    db/rows/             структуры строк PostgreSQL
    repositories/        SQL-запросы и транзакции SQLx
  services/              бизнес-правила и преобразование данных
  errors.rs              единый формат ошибок API
  routes.rs              маршруты REST API
  state.rs               общее состояние приложения
```

Поток запроса: `route -> handler -> service -> repository -> PostgreSQL`. HTTP-обработчики не содержат SQL, а API DTO отделены от структур чтения базы.

## Запуск

1. Установите Rust stable и PostgreSQL.
2. Создайте локальную базу `food_planner` и пользователя, указанного в `DATABASE_URL`.
3. Скопируйте `.env.example` в `.env`.
4. Укажите в `.env` реальные данные локального PostgreSQL и длинный случайный `JWT_ACCESS_SECRET`.
5. Запустите `cargo run` из директории `backend`.

Docker для запуска backend не требуется. Файл `docker-compose.yml` оставлен как дополнительный вариант для локальной разработки, если PostgreSQL на машине недоступен.

При старте API применяет SQL-миграции автоматически. Сервер слушает `0.0.0.0:3000`.

## Авторизация

- `POST /api/v1/auth/register` — регистрация и выдача Access/Refresh токенов.
- `POST /api/v1/auth/login` — вход по email и паролю.
- `POST /api/v1/auth/refresh` — ротация Refresh-токена и выдача новой пары.
- `POST /api/v1/auth/logout` — отзыв Refresh-токена.
- `GET /api/v1/auth/me` — текущий пользователь, требует `Authorization: Bearer <accessToken>`.

Access-токен — JWT с коротким TTL, Refresh-токен — случайное непрозрачное значение. В базе хранится только SHA-256 хеш Refresh-токена. Пароли хранятся как Argon2-хеши.

## Основные ресурсы

- `GET/PUT /api/v1/profile` — цели питания, бюджет, калории, аллергены и нелюбимые продукты.
- `GET/POST /api/v1/pantry` — домашние запасы; повторное добавление продукта увеличивает количество.
- `PUT/DELETE /api/v1/pantry/:id` — изменение и удаление запаса.
- `GET /api/v1/recipes` и `GET /api/v1/recipes/:id` — каталог рецептов и ингредиентов.
- `GET/POST /api/v1/meal-plans` и `GET /api/v1/meal-plans/:id` — планы недель.
- `GET /api/v1/meal-plan` — последний план пользователя.
- `GET /api/v1/shopping-list` — последний список покупок.
- `PATCH /api/v1/shopping-list/items/:id` — отметить продукт купленным или вернуть в список.
- `GET /health` — проверка подключения к PostgreSQL.

Роуты профиля, запасов, планов и покупок требуют Access-токен. Каталог рецептов доступен без авторизации.

## Подключение Expo

Клиент читает `EXPO_PUBLIC_API_URL`; по умолчанию это `http://localhost:3000/api/v1`. Для физического телефона задайте адрес компьютера в локальной сети, например `EXPO_PUBLIC_API_URL=http://192.168.1.10:3000/api/v1`, и перезапустите Expo. На Android Emulator обычно используется `http://10.0.2.2:3000/api/v1`.

CORS сейчас открыт для локальной разработки. Перед публикацией ограничьте разрешённые origins, вынесите секреты в секретное хранилище и добавьте rate limit для auth-роутов.
