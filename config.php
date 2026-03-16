<?php
// config.php - настройки нашего приложения

// Включаем отображение ошибок (только для разработки!)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Настройки базы данных
define('DB_HOST', 'localhost');     // Где находится база данных
define('DB_NAME', 'volga_expanses');  // Имя базы данных
define('DB_USER', 'root');          // Имя пользователя (по умолчанию root)
define('DB_PASS', '');              // Пароль (по умолчанию пустой)

// Настройки сессии
session_start(); // Начинаем сессию для хранения данных пользователя

// Функция для подключения к базе данных
function getDBConnection() {
    try {
        // Пробуем подключиться к базе данных
        $pdo = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8",
            DB_USER,
            DB_PASS
        );
        
        // Устанавливаем режим ошибок
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        return $pdo; // Возвращаем объект подключения
        
    } catch(PDOException $e) {
        // Если не удалось подключиться, показываем ошибку
        die("Ошибка подключения к базе данных: " . $e->getMessage());
    }
}
?>