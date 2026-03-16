document.addEventListener('DOMContentLoaded', function(){
    const password = document.getElementById('password');
    const passwordConfirm = document.getElementById('passwordConfirm');

    password.addEventListener('input', function(){
       checkPasswordMatch();
        })
    passwordConfirm.addEventListener('input', checkPasswordMatch);

        function checkPasswordMatch(){
        if(passwordConfirm.value.length > 0){
            if(password.value == passwordConfirm.value && password.value.length >= 6){
                passwordConfirm.classList.remove('error');
                passwordConfirm.classList.add('valid');
                document.getElementById('passwordConfirmError').textContent = '';
                return true;
            }else{
                passwordConfirm.classList.remove('valid');
                passwordConfirm.classList.add('error');
                document.getElementById('passwordConfirmError').textContent = 'Пароли не совпадают';
                return false;
            };
        };
    };
});