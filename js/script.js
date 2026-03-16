// script.js - Основной JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Переключение темы
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');
    
    themeToggle.addEventListener('click', function() {
        const body = document.body;
        const isDarkTheme = body.classList.contains('dark-theme');
        
        if (isDarkTheme) {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            themeIcon.textContent = '🌙';
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            themeIcon.textContent = '☀️';
            localStorage.setItem('theme', 'dark');
        }
    });
    
    // Загрузка темы из localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeIcon.textContent = '☀️';
    }
    
    // Мобильное меню
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.querySelector('.nav');
    
    menuToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
    
    // Слайдер
    const track = document.querySelector('.slider-track');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    const indicators = document.querySelectorAll('.indicator');
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    function updateSlider() {
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Обновление индикаторов
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });
        
        // Обновление слайдов
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlide);
        });
    }
    
    prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlider();
    });
    
    nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    });
    
    // Клик по индикаторам
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentSlide = index;
            updateSlider();
        });
    });
    
    // Автопрокрутка слайдера
    let slideInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    }, 5000);
    
    // Пауза при наведении
    const slider = document.querySelector('.slider');
    slider.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    slider.addEventListener('mouseleave', () => {
        slideInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlider();
        }, 5000);
    });
    
    // Валидация форм
    const loginForm = document.getElementById('loginForm');
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('#email');
            const password = this.querySelector('#password');
            let isValid = true;
            
            // Сброс ошибок
            [email, password].forEach(input => {
                input.classList.remove('error');
                const errorMsg = input.nextElementSibling;
                if (errorMsg && errorMsg.classList.contains('error-message')) {
                    errorMsg.remove();
                }
            });
            
            // Проверка email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value)) {
                showError(email, 'Введите корректный email');
                isValid = false;
            }
            
            // Проверка пароля
            if (password.value.length < 6) {
                showError(password, 'Пароль должен содержать минимум 6 символов');
                isValid = false;
            }
            
            if (isValid) {
                // Имитация успешного входа
                alert('Вход выполнен успешно!');
                this.reset();
            }
        });
    }
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]');
            const consent = this.querySelector('#newsletter-consent');
            let isValid = true;
            
            // Сброс ошибок
            email.classList.remove('error');
            const errorMsg = email.nextElementSibling;
            if (errorMsg && errorMsg.classList.contains('error-message')) {
                errorMsg.remove();
            }
            
            // Проверка email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value)) {
                showError(email, 'Введите корректный email');
                isValid = false;
            }
            
            // Проверка согласия
            if (!consent.checked) {
                alert('Необходимо согласие на обработку персональных данных');
                isValid = false;
            }
            
            if (isValid) {
                // Имитация успешной подписки
                alert('Вы успешно подписались на рассылку!');
                this.reset();
            }
        });
    }
    
    function showError(input, message) {
        input.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = '#f44336';
        errorDiv.style.fontSize = '0.8rem';
        errorDiv.style.marginTop = '5px';
        errorDiv.textContent = message;
        input.parentNode.appendChild(errorDiv);
    }
    
    // Плавная прокрутка
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#') && href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    // Закрываем мобильное меню
                    if (nav.classList.contains('active')) {
                        nav.classList.remove('active');
                        menuToggle.classList.remove('active');
                    }
                    
                    // Плавная прокрутка
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Анимация при прокрутке
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Наблюдаем за элементами для анимации
    document.querySelectorAll('.tour-card, .review-card, .slide').forEach(el => {
        observer.observe(el);
    });
    
    // Динамическое обновление года в футере
    const yearSpan = document.querySelector('.current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});