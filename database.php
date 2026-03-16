<?php
// database.php - подключение к базе данных
require_once 'config.php';

// Подключаемся к базе данных
try {
    $pdo = getDBConnection();
     echo "Успешно подключились к базе данных!"; // Можно раскомментировать для проверки
    
} catch(PDOException $e) {
    // Если ошибка, показываем сообщение
    die("Ошибка: " . $e->getMessage());
}
?>