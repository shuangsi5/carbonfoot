function showForm(formName) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const tabLinks = document.querySelectorAll('.tab-link');

    if (formName === 'login') {
        loginForm.classList.add('active-form');
        registerForm.classList.remove('active-form');
        tabLinks[0].classList.add('active');
        tabLinks[1].classList.remove('active');
    } else {
        loginForm.classList.remove('active-form');
        registerForm.classList.add('active-form');
        tabLinks[0].classList.remove('active');
        tabLinks[1].classList.add('active');
    }
}

// 注册逻辑
const registerForm = document.getElementById('register-form');
const registerMessage = document.getElementById('register-message');

registerForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;

    if (password !== confirmPassword) {
        registerMessage.textContent = '两次输入的密码不匹配！';
        registerMessage.style.color = 'red';
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = users.some(user => user.username === username);

    if (userExists) {
        registerMessage.textContent = '用户名已存在！';
        registerMessage.style.color = 'red';
    } else {
        users.push({ username, email, password });
        localStorage.setItem('users', JSON.stringify(users));
        
        // 注册成功后，自动为用户登录
        localStorage.setItem('currentUser', username);

        registerMessage.textContent = '注册成功！正在跳转到首页...';
        registerMessage.style.color = 'var(--primary-color)';
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    }
});

// 登录逻辑
const loginForm = document.getElementById('login-form');
const loginMessage = document.getElementById('login-message');

loginForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    let users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        localStorage.setItem('currentUser', username);
        loginMessage.textContent = '登录成功！正在跳转到首页...';
        loginMessage.style.color = 'var(--primary-color)';
         setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    } else {
        loginMessage.textContent = '用户名或密码错误！';
        loginMessage.style.color = 'red';
    }
});

// 游客模式
document.querySelector('.guest').addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.removeItem('currentUser'); // 清除当前用户以确保是游客状态
    window.location.href = 'dashboard.html';
}); 