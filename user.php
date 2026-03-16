<?php
require_once __DIR__ . '/database.php';
class User{
    private $conn;
    private $table_name = "users";

    //свойства пользователя
    public $id;
    public $email;
    public $last_name;
    public $first_name;
    public $age;
    public $gender;
    public $password;
    public $photo;

    public function __construct(){
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    public function register(){
        $query = "INSERT INTO " . $this->table_name . " 
        (email, last_name, first_name, age, gender, password, photo)
        VALUES
        (:email, :last_name, :first_name, :age, :gender, :password, :photo)";

        $stmt= $this->conn->prepare($query);

        //очистка данных
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->last_name = htmlspecialchars(strip_tags($this->last_name));
        $this->first_name = htmlspecialchars(strip_tags($this->first_name));
        $this->age = htmlspecialchars(strip_tags($this->age));
        $this->gender = htmlspecialchars(strip_tags($this->gender));
        $this->password = htmlspecialchars(strip_tags($this->password));
        $this->photo = htmlspecialchars(strip_tags($this->photo));

        if($stmt->execute()) {
            $this->id = $this->conn->lastIndertId();
            return[
                'success' => true, 
                'message' => 'Регистрация успешна', 
                'user_id' => $this->id
            ];
        } return['succes' => false, 'massage'=>'Ошибка при регистрации'];


    }

}