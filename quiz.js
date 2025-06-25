// 题目数据库
const questions = [
    {
        question: "以下哪种交通方式的碳排放最低？",
        options: ["私家车", "公交车", "自行车", "飞机"],
        correct: 2,
        explanation: "自行车是最环保的交通方式，零碳排放。公交车虽然也有碳排放，但人均排放量远低于私家车。"
    },
    {
        question: "全球变暖的主要原因是？",
        options: ["太阳活动增强", "温室气体排放", "地球轨道变化", "火山活动"],
        correct: 1,
        explanation: "人类活动产生的温室气体（如CO₂、甲烷等）是导致全球变暖的主要原因。"
    },
    {
        question: "以下哪种食物生产过程的碳排放最高？",
        options: ["蔬菜", "水果", "牛肉", "鸡肉"],
        correct: 2,
        explanation: "牛肉生产需要大量饲料、水和土地，同时牛还会产生甲烷，因此碳排放最高。"
    },
    {
        question: "节能灯比白炽灯节能多少？",
        options: ["20%", "50%", "80%", "95%"],
        correct: 2,
        explanation: "节能灯比白炽灯节能约80%，同时使用寿命也更长。"
    },
    {
        question: "以下哪种行为最有助于减少碳足迹？",
        options: ["使用一次性餐具", "购买本地食品", "开车短途出行", "开空调睡觉"],
        correct: 1,
        explanation: "购买本地食品可以减少运输距离，从而减少碳排放。"
    },
    {
        question: "海洋酸化主要是由什么引起的？",
        options: ["海洋温度升高", "CO₂溶解", "塑料污染", "过度捕捞"],
        correct: 1,
        explanation: "大气中的CO₂溶解到海洋中形成碳酸，导致海洋酸化。"
    },
    {
        question: "以下哪种能源是可再生能源？",
        options: ["煤炭", "石油", "太阳能", "天然气"],
        correct: 2,
        explanation: "太阳能是可再生能源，取之不尽用之不竭，且无污染。"
    },
    {
        question: "垃圾分类的主要目的是？",
        options: ["减少垃圾量", "提高回收率", "节省处理成本", "以上都是"],
        correct: 3,
        explanation: "垃圾分类可以同时实现减少垃圾量、提高回收率和节省处理成本。"
    },
    {
        question: "以下哪种行为会增加碳足迹？",
        options: ["步行上班", "使用公共交通工具", "购买过度包装的商品", "使用节能电器"],
        correct: 2,
        explanation: "过度包装会产生更多垃圾，增加生产和处理过程的碳排放。"
    },
    {
        question: "碳足迹是指？",
        options: ["个人产生的垃圾量", "个人消耗的能源", "个人活动产生的温室气体总量", "个人使用的交通工具"],
        correct: 2,
        explanation: "碳足迹是指个人、组织或产品在其生命周期中直接或间接产生的温室气体排放总量。"
    },
    {
        question: "以下哪种做法最环保？",
        options: ["使用一次性塑料袋", "使用可重复使用的购物袋", "使用纸袋", "不使用任何袋子"],
        correct: 1,
        explanation: "可重复使用的购物袋可以多次使用，减少资源消耗和环境污染。"
    },
    {
        question: "全球平均温度上升多少度被认为是危险的？",
        options: ["1°C", "2°C", "3°C", "4°C"],
        correct: 1,
        explanation: "科学家认为全球平均温度上升超过2°C将带来不可逆转的灾难性后果。"
    },
    {
        question: "以下哪种行为有助于减少碳排放？",
        options: ["经常开车", "使用电梯", "步行或骑自行车", "开空调"],
        correct: 2,
        explanation: "步行或骑自行车是零碳排放的出行方式，最环保。"
    },
    {
        question: "以下哪种材料最难降解？",
        options: ["纸张", "塑料", "木材", "布料"],
        correct: 1,
        explanation: "塑料在自然环境中需要数百年才能降解，是最难降解的材料之一。"
    },
    {
        question: "以下哪种行为最浪费水资源？",
        options: ["刷牙时关水龙头", "使用节水马桶", "长时间淋浴", "收集雨水浇花"],
        correct: 2,
        explanation: "长时间淋浴会浪费大量水资源，应该控制淋浴时间。"
    }
];

let currentQuestionIndex = 0;
let userAnswers = [];
let quizQuestions = [];

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    // 检查是否有进行中的测试
    const savedQuiz = localStorage.getItem('currentQuiz');
    if (savedQuiz) {
        const quizData = JSON.parse(savedQuiz);
        currentQuestionIndex = quizData.currentQuestionIndex;
        userAnswers = quizData.userAnswers;
        quizQuestions = quizData.questions;
        showQuizScreen();
    }
});

// 开始测试
function startQuiz() {
    // 随机选择10道题目
    quizQuestions = getRandomQuestions(10);
    currentQuestionIndex = 0;
    userAnswers = [];
    
    // 保存测试状态
    saveQuizState();
    
    // 显示加载动画
    document.getElementById('loadingOverlay').classList.add('show');
    
    setTimeout(() => {
        document.getElementById('loadingOverlay').classList.remove('show');
        showQuizScreen();
        displayQuestion();
    }, 1500);
}

// 获取随机题目
function getRandomQuestions(count) {
    const shuffled = questions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// 显示答题界面
function showQuizScreen() {
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('quizScreen').style.display = 'block';
    document.getElementById('resultScreen').style.display = 'none';
}

// 显示题目
function displayQuestion() {
    const question = quizQuestions[currentQuestionIndex];
    const questionText = document.getElementById('questionText');
    const optionsContainer = document.getElementById('optionsContainer');
    const progressText = document.getElementById('progressText');
    const progressFill = document.getElementById('progressFill');
    
    // 更新进度
    const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
    progressText.textContent = `${currentQuestionIndex + 1} / ${quizQuestions.length}`;
    progressFill.style.width = progress + '%';
    
    // 显示题目
    questionText.textContent = question.question;
    
    // 显示选项
    optionsContainer.innerHTML = question.options.map((option, index) => `
        <label class="option">
            <input type="radio" name="answer" value="${index}" onchange="enableSubmit()">
            <span class="option-text">${option}</span>
        </label>
    `).join('');
    
    // 重置提交按钮
    document.getElementById('submitBtn').style.display = 'none';
}

// 启用提交按钮
function enableSubmit() {
    document.getElementById('submitBtn').style.display = 'block';
}

// 提交答案
function submitAnswer() {
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');
    
    if (!selectedAnswer) {
        alert('请选择一个答案！');
        return;
    }
    
    const answer = parseInt(selectedAnswer.value);
    userAnswers.push(answer);
    
    // 保存测试状态
    saveQuizState();
    
    // 检查是否还有下一题
    if (currentQuestionIndex < quizQuestions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    } else {
        // 测试完成，显示结果
        showResults();
    }
}

// 显示结果
function showResults() {
    const score = calculateScore();
    const grade = getGrade(score);
    
    // 显示结果界面
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('quizScreen').style.display = 'none';
    document.getElementById('resultScreen').style.display = 'block';
    
    // 更新分数显示
    document.getElementById('scoreDisplay').textContent = score;
    document.getElementById('gradeBadge').textContent = grade.level;
    
    // 显示详细结果
    displayDetailedResults();
    
    // 保存测试结果
    saveQuizResult(score, grade);
    
    // 清除当前测试状态
    localStorage.removeItem('currentQuiz');
}

// 计算分数
function calculateScore() {
    let correctAnswers = 0;
    
    for (let i = 0; i < quizQuestions.length; i++) {
        if (userAnswers[i] === quizQuestions[i].correct) {
            correctAnswers++;
        }
    }
    
    return Math.round((correctAnswers / quizQuestions.length) * 100);
}

// 获取等级
function getGrade(score) {
    if (score >= 90) {
        return { level: '环保大师', icon: '🌿' };
    } else if (score >= 80) {
        return { level: '环保达人', icon: '🌱' };
    } else if (score >= 70) {
        return { level: '环保新手', icon: '🌍' };
    } else if (score >= 60) {
        return { level: '环保学习者', icon: '🌱' };
    } else {
        return { level: '环保初学者', icon: '🌱' };
    }
}

// 显示详细结果
function displayDetailedResults() {
    const answersContainer = document.getElementById('answersContainer');
    
    answersContainer.innerHTML = quizQuestions.map((question, index) => {
        const userAnswer = userAnswers[index];
        const isCorrect = userAnswer === question.correct;
        const userAnswerText = question.options[userAnswer];
        const correctAnswerText = question.options[question.correct];
        
        return `
            <div class="question-result">
                <div class="question-header">
                    <span class="question-number">题目 ${index + 1}</span>
                    <span class="result-icon">${isCorrect ? '✅' : '❌'}</span>
                </div>
                <div class="question-text">${question.question}</div>
                <div class="answer-info">
                    <div class="your-answer ${isCorrect ? 'correct' : 'incorrect'}">
                        您的答案: ${userAnswerText}
                    </div>
                    ${!isCorrect ? `<div class="correct-answer">正确答案: ${correctAnswerText}</div>` : ''}
                </div>
                <div class="explanation">
                    <div class="explanation-title">💡 解析</div>
                    <div class="explanation-content">${question.explanation}</div>
                </div>
            </div>
        `;
    }).join('');
}

// 保存测试状态
function saveQuizState() {
    const quizState = {
        currentQuestionIndex,
        userAnswers,
        questions: quizQuestions
    };
    localStorage.setItem('currentQuiz', JSON.stringify(quizState));
}

// 保存测试结果
function saveQuizResult(score, grade) {
    const result = {
        score,
        grade: grade.level,
        timestamp: new Date().toISOString(),
        questions: quizQuestions.length,
        correctAnswers: userAnswers.filter((answer, index) => answer === quizQuestions[index].correct).length
    };
    
    const quizResults = JSON.parse(localStorage.getItem('quizResults')) || [];
    quizResults.push(result);
    localStorage.setItem('quizResults', JSON.stringify(quizResults));
} 