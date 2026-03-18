// Когда страница полностью загружена, выполняем наш код
document.addEventListener('DOMContentLoaded', function(){
    
    // Получаем элементы формы по их ID (как ищем элементы в HTML)
    const password = document.getElementById('password'); // поле пароля
    const passwordConfirm = document.getElementById('passwordConfirm'); // поле для повтора пароля
    const registrationForm = document.getElementById('registrationForm'); // вся форма регистрации
    const submitBtn = document.getElementById('submitBtn'); // кнопка "Зарегистрироваться"

    // СОБЫТИЕ 1: Когда пользователь печатает пароль или повторяет пароль
    password.addEventListener('input', function(){
        checkPasswordMatch(); // проверяем, совпадают ли пароли
    });
    
    passwordConfirm.addEventListener('input', function(){
        checkPasswordMatch(); // проверяем ещё раз
    });

    // ФУНКЦИЯ: Проверка совпадения паролей
    function checkPasswordMatch(){
        // Если пользователь что-то написал в поле повтора пароля
        if(passwordConfirm.value.length > 0){
            // Если пароли совпадают И пароль минимум 6 символов
            if(password.value === passwordConfirm.value && password.value.length >= 6){
                // Убираем красный цвет ошибки
                passwordConfirm.classList.remove('error');
                // Добавляем зелёный цвет для успеха
                passwordConfirm.classList.add('valid');
                // Очищаем сообщение об ошибке
                document.getElementById('passwordConfirmError').textContent = '';
                return true; // пароли совпадают - всё хорошо!
            } 
            else {
                // Убираем зелёный цвет
                passwordConfirm.classList.remove('valid');
                // Добавляем красный цвет для ошибки
                passwordConfirm.classList.add('error');
                // Показываем сообщение об ошибке
                document.getElementById('passwordConfirmError').textContent = 'Пароли не совпадают!';
                return false; // пароли НЕ совпадают - ошибка!
            }
        }
        return false;
    }

    // СОБЫТИЕ 2: Когда пользователь нажимает кнопку "Зарегистрироваться"
    registrationForm.addEventListener('submit', function(e) {
        // e.preventDefault() - не отправляем форму обычным способом,
        // а обработаем её сами через JavaScript
        e.preventDefault();

        // Проверяем, что пароли совпадают
        if (!checkPasswordMatch()) {
            alert('❌ Ошибка: Пароли не совпадают!');
            return; // останавливаем выполнение
        }

        // Собираем все данные из формы в один объект
        const formData = {
            // .trim() убирает пробелы в начале и конце
            email: document.getElementById('email').value.trim(),
            firstname: document.getElementById('firstname').value.trim(),
            lastname: document.getElementById('lastname').value.trim(),
            age: parseInt(document.getElementById('age').value), // parseInt переводит текст в число
            gender: document.querySelector('input[name="gender"]:checked').value, // какой пол выбран
            password: document.getElementById('password').value,
            photo: null // фото пока пустое
        };

        // Проверяем, загрузил ли пользователь фото
        const photoInput = document.getElementById('photo');
        
        if (photoInput.files.length > 0) {
            // Если файл есть, то берём первый файл (files[0])
            const file = photoInput.files[0];
            
            // Проверяем размер файла (максимум 5 МБ = 5 миллионов байтов)
            if (file.size > 5242880) {
                alert('❌ Фото слишком большое! Максимум 5 МБ.');
                return;
            }

            // Преобразуем фото в текстовый формат (base64)
            // Это нужно, чтобы можно было отправить фото вместе с другими данными
            const reader = new FileReader(); // читалка файлов
            
            // Когда файл прочитан, выполняем эту функцию
            reader.onload = function(event) {
                // event.target.result содержит фото в формате base64
                formData.photo = event.target.result;
                // Отправляем данные на сервер
                sendRegistrationData(formData);
            };
            
            // Начинаем читать файл
            reader.readAsDataURL(file);
        } else {
            // Если фото не загружено, просто отправляем данные
            sendRegistrationData(formData);
        }
    });

    // ФУНКЦИЯ: Отправка данных на сервер
    async function sendRegistrationData(formData) {
        try {
            // Отключаем кнопку, чтобы пользователь не мог нажать её дважды
            submitBtn.disabled = true;
            submitBtn.textContent = 'Загрузка...'; // меняем текст кнопки

            // Отправляем данные на сервер (на файл register.php)
            // fetch - это способ отправки данных на сервер
            const response = await fetch('register.php', {
                method: 'POST', // используем метод POST (отправка)
                headers: {
                    // Говорим серверу, что мы отправляем JSON
                    'Content-Type': 'application/json'
                },
                // JSON.stringify преобразует объект в текстовый формат JSON
                body: JSON.stringify(formData)
            });

            // Читаем ответ от сервера
            const result = await response.json();

            // Проверяем, успешно ли прошла регистрация
            if (result.success) {
                // ✅ УСПЕХ! Показываем модальное окно
                showSuccessModal();
                // Очищаем форму (все поля становятся пустыми)
                registrationForm.reset();
            } else {
                // ❌ ОШИБКА! Показываем сообщение об ошибке
                alert('❌ Ошибка: ' + result.message);
            }
        } catch (error) {
            // Если что-то пошло не так (например, нет интернета)
            console.error('Ошибка при регистрации:', error);
            alert('❌ Ошибка при отправке данных. Попробуйте позже.');
        } finally {
            // Это выполняется в любом случае (успех или ошибка)
            // Включаем кнопку обратно
            submitBtn.disabled = false;
            submitBtn.textContent = 'Зарегистрироваться'; // возвращаем исходный текст
        }
    }

    // ФУНКЦИЯ: Показать окно "Успешно!"
    function showSuccessModal() {
        // Находим модальное окно
        const successModal = document.getElementById('successModal');
        if (successModal) {
            // Показываем окно (меняем display на block)
            successModal.style.display = 'block';
            
            // Когда пользователь нажимает на крестик, закрываем окно
            const closeModal = document.getElementById('closeModal');
            if (closeModal) {
                closeModal.addEventListener('click', function() {
                    successModal.style.display = 'none';
                });
            }
        }
    }

    // ФУНКЦИЯ: Предпросмотр фото перед отправкой
    const photoUpload = document.getElementById('photoUpload'); // место для загрузки фото
    const photoInput = document.getElementById('photo'); // скрытое поле для выбора файла
    const previewImage = document.getElementById('previewImage'); // картинка для предпросмотра

    if (photoUpload) {
        // Когда пользователь кликает на область фото
        photoUpload.addEventListener('click', function() {
            // Открываем окно выбора файла
            photoInput.click();
        });

        // Когда пользователь выбрал файл
        photoInput.addEventListener('change', function() {
            if (this.files.length > 0) {
                // Если файл выбран, берём первый файл
                const file = this.files[0];
                // Создаём читалку файлов
                const reader = new FileReader();
                
                // Когда файл прочитан, показываем его как предпросмотр
                reader.onload = function(e) {
                    // Меняем картинку на загруженное фото
                    previewImage.src = e.target.result;
                };
                
                // Начинаем читать файл
                reader.readAsDataURL(file);
            }
        });
    }
});
