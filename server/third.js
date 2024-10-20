const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 8082;
let tokenLogin = "";

// Используем CORS с указанием разрешенного origin (можно указать '*', если разрешаем для всех)
app.use(cors({ origin: "*" }));

// Middleware для обработки JSON-запросов
app.use(express.json());

// Временное хранилище анонсов
let announcements = [
    {
        id: 1,
        message: "Third server test message",
        from: "2024-10-20 10:35:01",
        to: "2024-10-20 12:45:01",
        active: "true",
    },
];

// Фиксированные учетные данные
const validUsername = "user";
const validPassword = "pwd";

// Генерация токена
function generateToken() {
    const header = btoa(JSON.stringify({ alg: "HS512", typ: "JWT" }));
    const payload = btoa(
        JSON.stringify({
            sub: "user",
            iat: Math.floor(Date.now() / 1000),
            rnd: Math.random().toString(36).substring(2),
        })
    );
    const signature = Array(32)
        .fill(null)
        .map(() => Math.random().toString(36).charAt(2))
        .join("");
    tokenLogin = `${header}.${payload}.${signature}`;
    return tokenLogin;
}

// Эндпоинт для получения токена
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (username === validUsername && password === validPassword) {
        return res.json({
            expiredPassword: false,
            accessToken: generateToken(),
        });
    }
    return res.status(401).json({ error: "Invalid credentials" });
});

// Middleware для проверки токена
function verifyToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token === tokenLogin) {
        next();
    } else {
        res.status(403).json({ error: "Invalid token" });
    }
}

// Эндпоинт для получения списка анонсов
app.get("/announcement", verifyToken, (req, res) => {
    res.json(announcements);
});

// Эндпоинт для добавления нового анонса
app.post("/announcement", verifyToken, (req, res) => {
    const { message, from, to, removeInactive } = req.body;

    if (!message || !from || !to || removeInactive === undefined) {
        return res.status(400).json({ error: "All fields are required" });
    }

    if (removeInactive) {
        announcements = announcements.filter((ann) => ann.active);
    }

    const newAnnouncement = {
        id: announcements.length + 1,
        message,
        from,
        to,
        active: true,
    };

    announcements.push(newAnnouncement);

    return res.json({
        success: true,
        message: "Announcement added successfully",
        announcement: newAnnouncement,
    });
});

// Эндпоинт для удаления анонса
app.delete("/announcement/:id", verifyToken, (req, res) => {
    const announcementId = parseInt(req.params.id, 10);

    announcements = announcements.filter((ann) => ann.id !== announcementId);
    res.json({
        success: true,
        message: `Announcement ${announcementId} deleted successfully`,
    });
});

// Эндпоинт для обновления анонса
app.put("/announcement/:id", verifyToken, (req, res) => {
    const announcementId = parseInt(req.params.id, 10);
    const { message, from, to, removeInactive } = req.body;

    if (!message || !from || !to || removeInactive === undefined) {
        return res.status(400).json({ error: "All fields are required" });
    }

    // Поиск анонса по ID
    const announcementIndex = announcements.findIndex(
        (ann) => ann.id === announcementId
    );

    if (announcementIndex === -1) {
        return res.status(404).json({ error: "Announcement not found" });
    }

    // Обновляем анонс
    announcements[announcementIndex] = {
        ...announcements[announcementIndex],
        message,
        from,
        to,
        active: !removeInactive, // Обновляем поле активности в зависимости от флага removeInactive
    };
    res.json({
        success: true,
        message: `Announcement ${announcementId} updated successfully`,
        announcement: announcements[announcementIndex],
    });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
