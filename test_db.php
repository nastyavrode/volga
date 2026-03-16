<?php
// test_db.php

require_once 'database.php';
require_once 'user.php';

$db = new Database();
if ($db->testConnection()) {
    echo "✅ Подключение к базе данных успешно!<br>";
} else {
    echo "❌ Ошибка подключения к базе данных!<br>";
}

// Проверка пользователей
$user = new User();
$query = "SELECT * FROM users ORDER BY registration_date DESC LIMIT 5";
$stmt = $user->conn->prepare($query);
$stmt->execute();
$users = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo "<h3>Последние зарегистрированные пользователи:</h3>";
if ($users) {
    echo "<pre>";
    print_r($users);
    echo "</pre>";
} else {
    echo "Пользователей пока нет";
}
?>