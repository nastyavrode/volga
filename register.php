<?php
// Говорим браузеру, что мы отправляем данные в формате JSON
header('Content-Type: application/json');

// Подключаем файлы с конфигурацией и классом User
require_once 'config.php';
require_once 'user.php';

// Получаем данные, которые отправила форма
// file_get_contents("php://input") - получает данные из запроса
// json_decode(..., true) - переводит JSON в обычный массив PHP
$data = json_decode(file_get_contents("php://input"), true);

// ПРОВЕРКА 1: Все ли поля заполнены?
// isset() проверяет, существует ли переменная
if (!isset($data['email']) || !isset($data['firstname']) || !isset($data['lastname']) || 
    !isset($data['age']) || !isset($data['gender']) || !isset($data['password'])) {
    
    // Если что-то не заполнено, отправляем ошибку
    echo json_encode([
        'success' => false,
        'message' => 'Заполните все поля! Email, Имя, Фамилия, Возраст, Пол и Пароль обязательны.'
    ]);
    exit; // Останавливаем скрипт
}

// ПРОВЕРКА 2: Email правильный?
// filter_var() проверяет формат email (должен быть @ и точка)
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        'success' => false,
        'message' => 'Email неправильный! Он должен быть вроде: example@mail.ru'
    ]);
    exit;
}

// ПРОВЕРКА 3: Пароль длинный ли?
// strlen() считает количество символов
if (strlen($data['password']) < 6) {
    echo json_encode([
        'success' => false,
        'message' => 'Пароль слишком короткий! Минимум 6 символов.'
    ]);
    exit;
}

// ПРОВЕРКА 4: Возраст подходящий ли?
// Проверяем, что возраст от 18 до 120 лет
$age = (int)$data['age']; // (int) переводит текст в число
if ($age < 18 || $age > 120) {
    echo json_encode([
        'success' => false,
        'message' => 'Возраст должен быть от 18 до 120 лет!'
    ]);
    exit;
}

// ВСЕ ПРОВЕРКИ ПРОЙДЕНЫ! Теперь создаём нового пользователя

// new User() - создаём новый объект класса User
$user = new User();

// Заполняем свойства пользователя данными из формы
$user->email = $data['email'];
$user->first_name = $data['firstname'];
$user->last_name = $data['lastname'];
$user->age = $data['age'];
$user->gender = $data['gender'];
$user->password = $data['password'];

// ФОТО: Если пользователь загрузил фото, сохраняем его
// Если фото не загружено, будет использовано фото по умолчанию
if (!empty($data['photo'])) {
    // empty() проверяет, есть ли данные
    $user->photo = 'custom_photo'; // Пока помечаем, что фото загружено
} else {
    // Если фото не загружено, выбираем фото по умолчанию в зависимости от пола
    if ($data['gender'] === 'male') {
        $user->photo = 'male.png';
    } else {
        $user->photo = 'female.png';
    }
}

// РЕГИСТРАЦИЯ: Сохраняем пользователя в базу данных
// $user->register() вызывает метод register из класса User
$result = $user->register();

// Проверяем, успешно ли прошла регистрация
if ($result['success']) {
    // Успех! Отправляем положительный ответ
    echo json_encode([
        'success' => true,
        'message' => 'Поздравляем! Вы успешно зарегистрировались!'
    ]);
} else {
    // Ошибка! Отправляем сообщение об ошибке
    echo json_encode([
        'success' => false,
        'message' => $result['message']
    ]);
}

?>

