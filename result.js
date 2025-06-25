// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    loadCalculationResult();
    createChart();
    generateSuggestions();
});

// 加载计算结果
function loadCalculationResult() {
    const lastCalculation = localStorage.getItem('lastCalculation');
    
    if (!lastCalculation) {
        // 如果没有计算结果，跳转到计算页面
        window.location.href = 'calculate.html';
        return;
    }
    
    const result = JSON.parse(lastCalculation);
    
    // 显示总碳足迹
    document.getElementById('totalFootprint').textContent = result.totalFootprint;
    
    // 确定碳足迹等级
    const level = determineFootprintLevel(result.totalFootprint);
    document.getElementById('footprintLevel').textContent = level;
    
    // 显示详细分析
    displayDetailedAnalysis(result);
    
    // 显示比较数据
    document.getElementById('yourFootprint').textContent = result.totalFootprint;
}

// 确定碳足迹等级
function determineFootprintLevel(footprint) {
    if (footprint <= 1000) {
        return '低碳生活 🌱';
    } else if (footprint <= 2000) {
        return '中等水平 🌍';
    } else if (footprint <= 3000) {
        return '较高水平 ⚠️';
    } else {
        return '高碳生活 🔥';
    }
}

// 显示详细分析
function displayDetailedAnalysis(result) {
    const resultList = document.getElementById('resultList');
    
    const analysis = [
        {
            category: '🚗 交通出行',
            value: result.details.transportation,
            percentage: Math.round((result.details.transportation / result.totalFootprint) * 100),
            description: getTransportDescription(result.details.transportation)
        },
        {
            category: '⚡ 能源使用',
            value: result.details.energy,
            percentage: Math.round((result.details.energy / result.totalFootprint) * 100),
            description: getEnergyDescription(result.details.energy)
        },
        {
            category: '🍽️ 饮食消费',
            value: result.details.food,
            percentage: Math.round((result.details.food / result.totalFootprint) * 100),
            description: getFoodDescription(result.details.food)
        },
        {
            category: '🛒 购物消费',
            value: result.details.shopping,
            percentage: Math.round((result.details.shopping / result.totalFootprint) * 100),
            description: getShoppingDescription(result.details.shopping)
        }
    ];
    
    resultList.innerHTML = analysis.map(item => `
        <li class="result-item">
            <div class="result-category">
                <span class="category-icon">${item.category.split(' ')[0]}</span>
                <span class="category-name">${item.category.split(' ').slice(1).join(' ')}</span>
            </div>
            <div class="result-details">
                <div class="result-value">${item.value} kg CO₂</div>
                <div class="result-percentage">${item.percentage}%</div>
            </div>
            <div class="result-description">${item.description}</div>
        </li>
    `).join('');
}

// 获取交通描述
function getTransportDescription(value) {
    if (value <= 500) {
        return '您的交通出行非常环保，主要使用公共交通或步行。';
    } else if (value <= 1000) {
        return '您的交通出行较为环保，建议减少私家车使用。';
    } else if (value <= 2000) {
        return '您的交通碳排放较高，建议多使用公共交通。';
    } else {
        return '您的交通碳排放很高，建议改变出行方式。';
    }
}

// 获取能源描述
function getEnergyDescription(value) {
    if (value <= 500) {
        return '您的能源使用非常节能，继续保持！';
    } else if (value <= 1000) {
        return '您的能源使用较为节能，可以进一步优化。';
    } else if (value <= 2000) {
        return '您的能源使用较高，建议使用节能电器。';
    } else {
        return '您的能源使用很高，建议更换节能设备。';
    }
}

// 获取饮食描述
function getFoodDescription(value) {
    if (value <= 300) {
        return '您的饮食习惯非常环保，多吃素食。';
    } else if (value <= 600) {
        return '您的饮食习惯较为环保，可以增加素食比例。';
    } else if (value <= 1000) {
        return '您的饮食碳排放较高，建议减少肉类消费。';
    } else {
        return '您的饮食碳排放很高，建议大幅调整饮食结构。';
    }
}

// 获取购物描述
function getShoppingDescription(value) {
    if (value <= 100) {
        return '您的购物习惯非常环保，避免过度消费。';
    } else if (value <= 300) {
        return '您的购物习惯较为环保，继续保持理性消费。';
    } else if (value <= 600) {
        return '您的购物碳排放较高，建议减少不必要的购买。';
    } else {
        return '您的购物碳排放很高，建议大幅减少消费。';
    }
}

// 创建图表
function createChart() {
    const lastCalculation = localStorage.getItem('lastCalculation');
    if (!lastCalculation) return;
    
    const result = JSON.parse(lastCalculation);
    const ctx = document.getElementById('carbonChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['交通出行', '能源使用', '饮食消费', '购物消费'],
            datasets: [{
                data: [
                    result.details.transportation,
                    result.details.energy,
                    result.details.food,
                    result.details.shopping
                ],
                backgroundColor: [
                    'rgba(0, 212, 170, 0.8)',
                    'rgba(116, 185, 255, 0.8)',
                    'rgba(162, 155, 254, 0.8)',
                    'rgba(255, 193, 7, 0.8)'
                ],
                borderColor: [
                    'rgba(0, 212, 170, 1)',
                    'rgba(116, 185, 255, 1)',
                    'rgba(162, 155, 254, 1)',
                    'rgba(255, 193, 7, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                            size: 14
                        }
                    }
                }
            }
        }
    });
}

// 生成个性化建议
function generateSuggestions() {
    const lastCalculation = localStorage.getItem('lastCalculation');
    if (!lastCalculation) return;
    
    const result = JSON.parse(lastCalculation);
    const suggestionsContainer = document.getElementById('suggestionsContainer');
    
    const suggestions = [];
    
    // 基于交通出行的建议
    if (result.details.transportation > 1000) {
        suggestions.push({
            icon: '🚗',
            title: '优化交通出行',
            content: '建议多使用公共交通、步行或骑自行车，减少私家车使用频率。'
        });
    }
    
    // 基于能源使用的建议
    if (result.details.energy > 1000) {
        suggestions.push({
            icon: '⚡',
            title: '节能降耗',
            content: '建议使用节能电器，养成随手关灯的习惯，合理使用空调。'
        });
    }
    
    // 基于饮食的建议
    if (result.details.food > 600) {
        suggestions.push({
            icon: '🍽️',
            title: '调整饮食结构',
            content: '建议增加素食比例，减少肉类消费，选择本地和季节性食品。'
        });
    }
    
    // 基于购物的建议
    if (result.details.shopping > 300) {
        suggestions.push({
            icon: '🛒',
            title: '理性消费',
            content: '建议避免冲动消费，选择环保产品，减少不必要的购买。'
        });
    }
    
    // 通用建议
    suggestions.push({
        icon: '🌱',
        title: '日常环保习惯',
        content: '养成垃圾分类、节约用水、使用可重复使用物品的好习惯。'
    });
    
    suggestions.push({
        icon: '📚',
        title: '持续学习',
        content: '关注环保知识，参与环保活动，影响身边的人一起行动。'
    });
    
    // 显示建议
    suggestionsContainer.innerHTML = suggestions.map(suggestion => `
        <div class="suggestion-item">
            <div class="suggestion-icon">${suggestion.icon}</div>
            <div class="suggestion-content">
                <h4 class="suggestion-title">${suggestion.title}</h4>
                <p class="suggestion-text">${suggestion.content}</p>
            </div>
        </div>
    `).join('');
}

// 退出登录
function logout() {
    localStorage.removeItem('currentUser');
    alert('已退出登录');
    window.location.href = 'login.html';
} 