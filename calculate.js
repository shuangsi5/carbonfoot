let currentSection = 1;
const totalSections = 4;

// 页面加载动画
document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('.form-section, .tip-box');
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        setTimeout(() => {
            element.style.transition = 'all 0.6s ease-out';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

// 更新进度指示器
function updateProgress() {
    const progress = (currentSection - 1) / (totalSections - 1) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    
    // 更新步骤状态
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        const stepNum = index + 1;
        step.classList.remove('active', 'completed');
        
        if (stepNum < currentSection) {
            step.classList.add('completed');
        } else if (stepNum === currentSection) {
            step.classList.add('active');
        }
    });
}

// 显示指定部分
function showSection(sectionNum) {
    // 隐藏所有部分
    for (let i = 1; i <= totalSections; i++) {
        document.getElementById(`section${i}`).style.display = 'none';
    }
    
    // 显示当前部分
    document.getElementById(`section${sectionNum}`).style.display = 'block';
    
    // 更新按钮状态
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const calculateBtn = document.getElementById('calculateBtn');
    
    prevBtn.style.display = sectionNum === 1 ? 'none' : 'block';
    nextBtn.style.display = sectionNum === totalSections ? 'none' : 'block';
    calculateBtn.style.display = sectionNum === totalSections ? 'block' : 'none';
    
    updateProgress();
}

// 下一步
function nextSection() {
    if (currentSection < totalSections) {
        currentSection++;
        showSection(currentSection);
    }
}

// 上一步
function previousSection() {
    if (currentSection > 1) {
        currentSection--;
        showSection(currentSection);
    }
}

// 表单提交
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('carbonForm').addEventListener('submit', function(e) {
        e.preventDefault();
        calculateCarbonFootprint();
    });
});

// 计算碳足迹
function calculateCarbonFootprint() {
    // 显示加载动画
    document.getElementById('loadingOverlay').classList.add('show');
    
    // 模拟计算过程
    setTimeout(() => {
        const formData = new FormData(document.getElementById('carbonForm'));
        const data = Object.fromEntries(formData);
        
        // 碳足迹计算（简化版）
        let totalFootprint = 0;
        
        // 交通碳排放
        const carCO2 = (parseFloat(data.carDistance) || 0) * 0.2; // 每公里0.2kg CO2
        const publicCO2 = (parseInt(data.publicTransport) || 0) * 0.05; // 每次0.05kg CO2
        const airCO2 = (parseInt(data.airTravel) || 0) * 100; // 每次100kg CO2
        totalFootprint += carCO2 + publicCO2 + airCO2;
        
        // 能源碳排放
        const electricityCO2 = (parseFloat(data.electricity) || 0) * 0.5; // 每度0.5kg CO2
        const gasCO2 = (parseFloat(data.gas) || 0) * 2.1; // 每立方米2.1kg CO2
        const heatingCO2 = (parseFloat(data.heating) || 0) * 0.1; // 每元0.1kg CO2
        totalFootprint += electricityCO2 + gasCO2 + heatingCO2;
        
        // 饮食碳排放
        const meatCO2 = (parseFloat(data.meatConsumption) || 0) * 13.3; // 每公斤13.3kg CO2
        const dairyCO2 = (parseFloat(data.dairyConsumption) || 0) * 1.4; // 每公斤1.4kg CO2
        const organicFactor = 1 - (parseFloat(data.organicFood) || 0) / 100 * 0.2; // 有机食品减少20%碳排放
        totalFootprint += (meatCO2 + dairyCO2) * organicFactor;
        
        // 购物碳排放
        const clothingCO2 = (parseFloat(data.clothing) || 0) * 0.01; // 每元0.01kg CO2
        const electronicsCO2 = (parseFloat(data.electronics) || 0) * 0.02; // 每元0.02kg CO2
        const wasteCO2 = (parseFloat(data.waste) || 0) * 0.5; // 每公斤0.5kg CO2
        totalFootprint += clothingCO2 + electronicsCO2 + wasteCO2;
        
        // 保存计算结果
        const result = {
            totalFootprint: Math.round(totalFootprint),
            details: {
                transportation: Math.round(carCO2 + publicCO2 + airCO2),
                energy: Math.round(electricityCO2 + gasCO2 + heatingCO2),
                food: Math.round((meatCO2 + dairyCO2) * organicFactor),
                shopping: Math.round(clothingCO2 + electronicsCO2 + wasteCO2)
            },
            timestamp: new Date().toISOString(),
            userData: data
        };
        
        // 保存到本地存储
        const calculations = JSON.parse(localStorage.getItem('calculations')) || [];
        calculations.push(result);
        localStorage.setItem('calculations', JSON.stringify(calculations));
        
        // 隐藏加载动画
        document.getElementById('loadingOverlay').classList.remove('show');
        
        // 跳转到结果页面
        localStorage.setItem('lastCalculation', JSON.stringify(result));
        window.location.href = 'result.html';
    }, 2000);
}

// 退出登录
function logout() {
    localStorage.removeItem('currentUser');
    alert('已退出登录');
    window.location.href = 'login.html';
}

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
    showSection(1);
}); 