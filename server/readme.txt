Для начала создадим простой сервер на Node.js с использованием Express, который будет отвечать на запросы по получению токена 
и обработке анонсов, включая механизм preflyte-запросов (проверочный запрос).

Шаги:
Установка необходимых зависимостей:
express для создания сервера
body-parser для работы с телом запросов
cors для работы с CORS-запросами (если необходимо)
dotenv для работы с переменными окружения (например, для хранения конфиденциальной информации, такой как токен)
Выполним установку зависимостей:

1. npm init -y
2. npm install express body-parser cors dotenv

1. Создание сервера на Node.js
2. Описание работы сервера:
Маршрут /login возвращает токен, если правильно указаны имя пользователя и пароль.
Маршрут /preflyte проверяет, может ли сервер обработать запрос (например, проверка перед добавлением/удалением анонса). 
Если запрос на действие canProcess поступает, сервер отвечает, что может обработать.
Маршрут /announcement (GET) возвращает список анонсов, если предоставлен корректный токен в заголовке Authorization.
Маршрут /announcement (POST) добавляет новый анонс, если токен корректен.
Маршрут /announcement/:id (DELETE) удаляет анонс по ID, если токен корректен.
3. Запуск сервера:
Для запуска сервера выполните:

node server.js

Теперь этот сервер может обрабатывать запросы от вашего React-приложения. 
Он включает проверку токена и поддерживает preflyte-запросы перед выполнением основных действий.

Вот примеры curl-запросов для каждого из описанных эндпоинтов на сервере:
1. Получение токена /login
curl --location 'http://localhost:8080/login' \
--header 'Content-Type: application/json' \
--data '{
    "username": "user",
    "password": "pwd"
}'

2. Проверочный preflyte-запрос /preflyte
curl --location 'http://localhost:8080/preflyte' \
--header 'Content-Type: application/json' \
--data '{
    "action": "canProcess"
}'

3. Получение списка анонсов /announcement
Для этого запроса необходимо передать токен, полученный на первом этапе:
curl --location 'http://localhost:8080/announcement' \
--header 'Authorization: Bearer eyJhbGciOiJIUzUxMiJ9.example.fake.token'

4. Добавление нового анонса /announcement
Здесь также необходимо передать токен:
curl --location 'http://localhost:8080/announcement' \
--header 'Authorization: Bearer eyJhbGciOiJIUzUxMiJ9.example.fake.token' \
--header 'Content-Type: application/json' \
--data '{
    "message": "Тестовое сообщение",
    "from": "2023-11-02 10:35:01",
    "to": "2023-11-02 12:45:01",
    "removeInactive": true
}'

5. Удаление анонса /announcement/:id
Токен также необходим:
curl --location --request DELETE 'http://localhost:8080/announcement/1' \
--header 'Authorization: Bearer eyJhbGciOiJIUzUxMiJ9.example.fake.token'