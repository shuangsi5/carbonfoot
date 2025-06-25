// 页面加载时获取用户信息
document.addEventListener('DOMContentLoaded', function() {
    loadUserInfo();
    loadStatistics();
    loadRecentActivity();
    setupNavigation();
});

// 加载用户信息
function loadUserInfo() {
    const currentUser = localStorage.getItem('currentUser');
    const userNameElement = document.getElementById('userName');
    const userEmailElement = document.getElementById('userEmail');
    
    if (currentUser) {
        // 获取用户详细信息
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.username === currentUser);
        
        if (user) {
            userNameElement.textContent = `欢迎回来，${user.username}！`;
            userEmailElement.textContent = user.email || '开始您的环保之旅吧';
        } else {
            userNameElement.textContent = `欢迎回来，${currentUser}！`;
            userEmailElement.textContent = '开始您的环保之旅吧';
        }
    } else {
        userNameElement.textContent = '欢迎来到碳足迹计算器！';
        userEmailElement.textContent = '以游客身份开始您的环保之旅吧';
    }
}

// 加载统计数据
function loadStatistics() {
    const calculations = JSON.parse(localStorage.getItem('calculations')) || [];
    const quizResults = JSON.parse(localStorage.getItem('quizResults')) || [];
    
    // 计算总计算次数
    const totalCalculations = calculations.length;
    document.getElementById('totalCalculations').textContent = totalCalculations;
    
    // 计算平均碳足迹
    let averageFootprint = 0;
    if (calculations.length > 0) {
        const totalFootprint = calculations.reduce((sum, calc) => sum + calc.totalFootprint, 0);
        averageFootprint = Math.round(totalFootprint / calculations.length);
    }
    document.getElementById('averageFootprint').textContent = averageFootprint;
    
    // 计算测试平均分
    let quizScore = 0;
    if (quizResults.length > 0) {
        const totalScore = quizResults.reduce((sum, result) => sum + result.score, 0);
        quizScore = Math.round(totalScore / quizResults.length);
    }
    document.getElementById('quizScore').textContent = quizScore;
    
    // 确定环保等级
    const ecoLevel = determineEcoLevel(averageFootprint, quizScore);
    document.getElementById('ecoLevel').textContent = ecoLevel.icon;
    document.querySelector('.badge').textContent = ecoLevel.level;
}

// 确定环保等级
function determineEcoLevel(footprint, quizScore) {
    if (footprint <= 1000 && quizScore >= 80) {
        return { icon: '🌿', level: '环保大师' };
    } else if (footprint <= 1500 && quizScore >= 70) {
        return { icon: '🌱', level: '环保达人' };
    } else if (footprint <= 2000 && quizScore >= 60) {
        return { icon: '🌍', level: '环保新手' };
    } else {
        return { icon: '🌱', level: '初级环保者' };
    }
}

// 加载最近活动
function loadRecentActivity() {
    const activityList = document.getElementById('activityList');
    const calculations = JSON.parse(localStorage.getItem('calculations')) || [];
    const quizResults = JSON.parse(localStorage.getItem('quizResults')) || [];
    
    // 合并所有活动并按时间排序
    const activities = [];
    
    calculations.forEach(calc => {
        activities.push({
            type: 'calculation',
            title: '完成碳足迹计算',
            description: `您的年碳足迹为 ${calc.totalFootprint} kg CO₂`,
            date: new Date(calc.timestamp),
            icon: '📊'
        });
    });
    
    quizResults.forEach(result => {
        activities.push({
            type: 'quiz',
            title: '完成环保知识测试',
            description: `得分：${result.score}/100`,
            date: new Date(result.timestamp),
            icon: '🎯'
        });
    });
    
    // 按时间排序（最新的在前）
    activities.sort((a, b) => b.date - a.date);
    
    // 显示最近5个活动
    const recentActivities = activities.slice(0, 5);
    
    if (recentActivities.length === 0) {
        activityList.innerHTML = `
            <div class="activity-item">
                <div class="activity-icon">🎉</div>
                <div class="activity-content">
                    <div class="activity-title">欢迎使用碳足迹计算器</div>
                    <div class="activity-description">开始您的环保之旅，让我们一起为地球做出贡献</div>
                    <div class="activity-date">刚刚</div>
                </div>
            </div>
        `;
    } else {
        activityList.innerHTML = recentActivities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">${activity.icon}</div>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-description">${activity.description}</div>
                    <div class="activity-date">${formatTimeAgo(activity.date)}</div>
                </div>
            </div>
        `).join('');
    }
}

// 格式化时间
function formatTimeAgo(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString();
}

// 设置导航
function setupNavigation() {
    const currentUser = localStorage.getItem('currentUser');
    const navLinks = document.getElementById('nav-links');
    
    if (currentUser) {
        navLinks.innerHTML = `
            <li><a href="dashboard.html" class="active">首页</a></li>
            <li><a href="calculate.html">计算</a></li>
            <li><a href="quiz.html">答题</a></li>
            <li><a href="login.html">退出</a></li>
        `;
    } else {
        navLinks.innerHTML = `
            <li><a href="dashboard.html" class="active">首页</a></li>
            <li><a href="calculate.html">计算</a></li>
            <li><a href="quiz.html">答题</a></li>
            <li><a href="login.html">登录</a></li>
        `;
    }
}

// 查看历史记录
function viewHistory() {
    // 滚动到环保数据区域
    const statsSection = document.getElementById('ecoStats');
    if (statsSection) {
        statsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // 弹出历史记录
    const calculations = JSON.parse(localStorage.getItem('calculations')) || [];
    if (calculations.length === 0) {
        alert('暂无计算历史记录');
        return;
    }
   
    alert(historyText);
}

// 查看个人设置
function viewProfile() {
    window.location.href = 'profile-view.html';
} 