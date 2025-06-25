// 个人资料展示页脚本

document.addEventListener('DOMContentLoaded', function() {
    // 粒子光效
    createParticles();

    const currentUser = localStorage.getItem('currentUser');
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === currentUser);
    if (!currentUser || !user) {
        alert('请先登录');
        window.location.href = 'login.html';
        return;
    }
    // 展示信息
    function renderDisplay() {
        document.getElementById('view-username').textContent = user.username;
        document.getElementById('view-email').textContent = user.email || '未设置';
        let regDate = user.registerDate;
        if (!regDate && user.createdAt) regDate = user.createdAt;
        if (!regDate) {
            regDate = new Date().toISOString();
            user.registerDate = regDate;
            localStorage.setItem('users', JSON.stringify(users));
        }
        document.getElementById('view-date').textContent = formatDate(regDate);
        document.getElementById('view-level').textContent = getEcoLevel(currentUser);
    }
    renderDisplay();

    // 编辑表单填充
    function fillEditForm() {
        document.getElementById('edit-username').value = user.username;
        document.getElementById('edit-email').value = user.email || '';
        document.getElementById('edit-password').value = '';
        document.getElementById('edit-confirm-password').value = '';
        document.getElementById('edit-message').textContent = '';
    }

    // 切换到编辑模式
    document.getElementById('editInfoBtn').onclick = function() {
        document.getElementById('profileDisplay').style.display = 'none';
        const editForm = document.getElementById('editForm');
        editForm.classList.add('active');
        fillEditForm();
    };
    // 取消编辑
    document.getElementById('cancelEditBtn').onclick = function() {
        document.getElementById('profileDisplay').style.display = '';
        document.getElementById('editForm').classList.remove('active');
    };
    // 保存编辑
    document.getElementById('editForm').onsubmit = function(e) {
        e.preventDefault();
        const email = document.getElementById('edit-email').value.trim();
        const password = document.getElementById('edit-password').value;
        const confirmPassword = document.getElementById('edit-confirm-password').value;
        const msg = document.getElementById('edit-message');
        msg.textContent = '';
        msg.style.color = '';
        // 校验
        if (!email) {
            msg.textContent = '邮箱不能为空';
            msg.style.color = 'red';
            return;
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            msg.textContent = '邮箱格式不正确';
            msg.style.color = 'red';
            return;
        }
        if (password || confirmPassword) {
            if (password !== confirmPassword) {
                msg.textContent = '两次输入的新密码不一致';
                msg.style.color = 'red';
                return;
            }
            if (password.length < 4) {
                msg.textContent = '新密码长度不能少于4位';
                msg.style.color = 'red';
                return;
            }
        }
        // 更新
        user.email = email;
        if (password) user.password = password;
        const updatedUsers = users.map(u => u.username === user.username ? user : u);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        msg.textContent = '保存成功！';
        msg.style.color = 'var(--primary-color)';
        setTimeout(() => {
            document.getElementById('profileDisplay').style.display = '';
            document.getElementById('editForm').classList.remove('active');
            renderDisplay();
        }, 800);
    };
});

function formatDate(isoStr) {
    const d = new Date(isoStr);
    return d.getFullYear() + '年' + (d.getMonth()+1) + '月' + d.getDate() + '日';
}

function getEcoLevel(username) {
    const calculations = JSON.parse(localStorage.getItem('calculations')) || [];
    const userCalcs = calculations.filter(c => c.userData && c.userData.username === username);
    if (userCalcs.length === 0) return '初级环保者';
    const avg = userCalcs.reduce((sum, c) => sum + (c.totalFootprint||0), 0) / userCalcs.length;
    if (avg <= 1000) return '白金环保者';
    if (avg <= 2000) return '黄金环保者';
    if (avg <= 3000) return '银牌环保者';
    return '青铜环保者';
}

// 粒子动画
function createParticles() {
    const container = document.getElementById('particlesBg');
    if (!container) return;
    const w = window.innerWidth, h = window.innerHeight;
    for (let i = 0; i < 20; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = Math.random() * 18 + 8;
        p.style.width = p.style.height = size + 'px';
        p.style.left = Math.random() * (w - size) + 'px';
        p.style.top = Math.random() * (h - size) + 'px';
        p.style.animationDuration = (10 + Math.random() * 8) + 's';
        p.style.animationDelay = (Math.random() * 10) + 's';
        container.appendChild(p);
    }
} 