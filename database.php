<?php
// Подключаем файл с настройками (хост БД, название, пароль и т.д.)
require_once 'config.php';

// Класс Database - это помощник для работы с базой данных
class Database {
    // Приватная переменная для хранения подключения к БД
    private $conn;

    // КОНСТРУКТОР - выполняется когда создаём new Database()
    public function __construct() {
        // Вызываем функцию getDBConnection() из config.php
        // Она создаёт подключение к БД и возвращает объект $pdo
        $this->conn = getDBConnection();
    }

    // ФУНКЦИЯ: Получить подключение к БД
    // Эту функцию вызывают другие классы (например, User) чтобы работать с БД
    public function getConnection() {
        return $this->conn; // возвращаем подключение
    }

    // ФУНКЦИЯ: Проверить, работает ли подключение к БД
    // Это помогает проверить, всё ли в порядке с подключением
    public function testConnection() {
        try {
            // Проверяем, существует ли подключение
            if ($this->conn) {
                echo "✅ Успешно подключились к базе данных!";
                return true; // всё хорошо
            }
            return false; // что-то не так
        } catch(Exception $e) {
            // Если произошла ошибка, выводим её
            echo "❌ Ошибка: " . $e->getMessage();
            return false;
        }
    }
}

?>
