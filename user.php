<?php
// Подключаем файл с настройками БД и функциями
require_once __DIR__ . '/database.php';

// Класс User - это шаблон для работы с пользователями
class User {
    // ПРИВАТНЫЕ ПЕРЕМЕННЫЕ ($ - обозначает переменную, private - только для этого класса)
    private $conn; // подключение к БД
    private $table_name = "users"; // имя таблицы в БД где хранятся пользователи

    // ПУБЛИЧНЫЕ ПЕРЕМЕННЫЕ (public - может использовать любой, кто работает с этим классом)
    // Это свойства пользователя
    public $id; // уникальный номер пользователя
    public $email; // электронная почта
    public $last_name; // фамилия
    public $first_name; // имя
    public $age; // возраст
    public $gender; // пол
    public $password; // пароль
    public $photo; // фото профиля

    // КОНСТРУКТОР - это функция, которая выполняется при создании нового User
    public function __construct() {
        // Создаём объект Database
        $database = new Database();
        // Получаем подключение к БД
        $this->conn = $database->getConnection();
    }

    // ФУНКЦИЯ: Регистрация нового пользователя
    public function register() {
        // ОЧИСТКА ДАННЫХ: Удаляем опасные символы из текста
        // htmlspecialchars() - заменяет < > " на безопасные коды
        // strip_tags() - удаляет HTML теги
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->last_name = htmlspecialchars(strip_tags($this->last_name));
        $this->first_name = htmlspecialchars(strip_tags($this->first_name));
        $this->age = htmlspecialchars(strip_tags($this->age));
        $this->gender = htmlspecialchars(strip_tags($this->gender));

        // ПРОВЕРКА 1: Есть ли уже пользователь с таким email?
        // Это нужно, чтобы не было двух аккаунтов с одинаковым email
        $checkQuery = "SELECT id FROM " . $this->table_name . " WHERE email = :email";
        // prepare() - подготавливает запрос к БД
        $checkStmt = $this->conn->prepare($checkQuery);
        // bindParam() - подставляет нашу переменную $this->email вместо :email
        $checkStmt->bindParam(':email', $this->email);
        // execute() - выполняет запрос к БД
        $checkStmt->execute();
        
        // rowCount() - считает сколько строк найдено
        // Если больше 0, значит такой email уже есть
        if ($checkStmt->rowCount() > 0) {
            return [
                'success' => false, 
                'message' => 'Пользователь с таким email уже существует! Используйте другой email.'
            ];
        }

        // ХЕШИРОВАНИЕ ПАРОЛЯ: Преобразуем пароль в непонятную кодовую последовательность
        // Это важно для безопасности! Если хакер украдёт БД, он не узнает пароли
        // password_hash() - создаёт безопасный хеш пароля
        $hashedPassword = password_hash($this->password, PASSWORD_DEFAULT);

        // ЗАПРОС К БД: Вставляем нового пользователя в таблицу
        $query = "INSERT INTO " . $this->table_name . " 
        (email, last_name, first_name, age, gender, password, photo)
        VALUES
        (:email, :last_name, :first_name, :age, :gender, :password, :photo)";

        // Подготавливаем запрос
        $stmt = $this->conn->prepare($query);

        // Подставляем наши данные вместо :email, :last_name и т.д.
        $stmt->bindParam(':email', $this->email);
        $stmt->bindParam(':last_name', $this->last_name);
        $stmt->bindParam(':first_name', $this->first_name);
        $stmt->bindParam(':age', $this->age);
        $stmt->bindParam(':gender', $this->gender);
        $stmt->bindParam(':password', $hashedPassword); // используем хешированный пароль!
        $stmt->bindParam(':photo', $this->photo);

        // Выполняем запрос и проверяем результат
        if ($stmt->execute()) {
            // ✅ УСПЕХ! Пользователь добавлен в БД
            // lastInsertId() - получает ID новопользователя (номер в БД)
            $this->id = $this->conn->lastInsertId();
            return [
                'success' => true, 
                'message' => 'Регистрация успешна! Вы можете войти в систему.', 
                'user_id' => $this->id
            ];
        }
        
        // ❌ ОШИБКА! Что-то пошло не так при добавлении в БД
        return [
            'success' => false, 
            'message' => 'Ошибка при регистрации! Попробуйте позже.'
        ];
    }
}

?>
