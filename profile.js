// 个人设置页面脚本

document.addEventListener('DOMContentLoaded', function() {
    const currentUser = localStorage.getItem('currentUser');
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === currentUser);
    const usernameInput = document.getElementById('profile-username');
    const emailInput = document.getElementById('profile-email');
    const passwordInput = document.getElementById('profile-password');
    const confirmPasswordInput = document.getElementById('profile-confirm-password');
    const passwordGroup = document.getElementById('password-group');
    const confirmPasswordGroup = document.getElementById('confirm-password-group');
    const messageDiv = document.getElementById('profile-message');
    const form = document.getElementById('profileForm');
    const editBtn = document.getElementById('editBtn');
    const editBtnRow = document.getElementById('editBtnRow');
    const backBtnRow = document.getElementById('backBtnRow');
    const cancelBtn = document.getElementById('cancelBtn');

    // 未登录直接跳转
    if (!currentUser || !user) {
        alert('请先登录');
        window.location.href = 'login.html';
        return;
    }

    // 显示当前信息
    usernameInput.value = user.username;
    emailInput.value = user.email || '';

    // 初始为只读模式
    setReadOnlyMode(true);

    // 点击"修改信息"进入编辑模式
    editBtn.addEventListener('click', function() {
        setReadOnlyMode(false);
        messageDiv.textContent = '';
    });

    // 点击"取消"恢复只读
    cancelBtn.addEventListener('click', function() {
        setReadOnlyMode(true);
        // 恢复原始信息
        emailInput.value = user.email || '';
        passwordInput.value = '';
        confirmPasswordInput.value = '';
        messageDiv.textContent = '';
    });

    // 表单提交
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        messageDiv.textContent = '';
        messageDiv.style.color = '';

        const newEmail = emailInput.value.trim();
        const newPassword = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        // 邮箱校验
        if (!newEmail) {
            messageDiv.textContent = '邮箱不能为空';
            messageDiv.style.color = 'red';
            return;
        }
        // 简单邮箱格式校验
        if (!/^\S+@\S+\.\S+$/.test(newEmail)) {
            messageDiv.textContent = '邮箱格式不正确';
            messageDiv.style.color = 'red';
            return;
        }

        // 密码校验
        if (newPassword || confirmPassword) {
            if (newPassword !== confirmPassword) {
                messageDiv.textContent = '两次输入的新密码不一致';
                messageDiv.style.color = 'red';
                return;
            }
            if (newPassword.length < 4) {
                messageDiv.textContent = '新密码长度不能少于4位';
                messageDiv.style.color = 'red';
                return;
            }
        }

        // 更新用户信息
        user.email = newEmail;
        if (newPassword) {
            user.password = newPassword;
        }
        // 更新本地存储
        const updatedUsers = users.map(u => u.username === user.username ? user : u);
        localStorage.setItem('users', JSON.stringify(updatedUsers));

        // 清空密码框
        passwordInput.value = '';
        confirmPasswordInput.value = '';

        messageDiv.textContent = '保存成功！';
        messageDiv.style.color = 'var(--primary-color)';
        setReadOnlyMode(true);
    });

    // 切换只读/编辑模式
    function setReadOnlyMode(isReadOnly) {
        emailInput.readOnly = isReadOnly;
        if (isReadOnly) {
            passwordGroup.classList.add('hidden');
            confirmPasswordGroup.classList.add('hidden');
            editBtn.classList.remove('hidden');
            editBtnRow.classList.add('hidden');
            backBtnRow.classList.remove('hidden');
        } else {
            passwordGroup.classList.remove('hidden');
            confirmPasswordGroup.classList.remove('hidden');
            editBtn.classList.add('hidden');
            editBtnRow.classList.remove('hidden');
            backBtnRow.classList.add('hidden');
        }
    }
}); 