const API_KEY = 'sk-330f84a039fc438184175fce49516d57';
const API_URL = 'https://api.deepseek.com/v1/chat/completions';

const chatMessages = document.getElementById('chatMessages');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');

let messages = [
    { role: 'system', content: '你是一个中文AI助手，可以解答生活、环保、碳足迹等问题。' }
];

let thinkingBubble = null;

function appendMessage(role, content) {
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble ' + (role === 'user' ? 'user' : 'ai');
    
    const bubbleHeader = document.createElement('div');
    bubbleHeader.className = 'bubble-header';
    bubbleHeader.textContent = role === 'user' ? '👤 您' : '🤖 DeepSeek助手';
    bubble.appendChild(bubbleHeader);
    
    const bubbleContent = document.createElement('div');
    bubbleContent.className = 'bubble-content';
    bubbleContent.textContent = content;
    bubble.appendChild(bubbleContent);

    const time = document.createElement('div');
    time.className = 'bubble-time';
    time.textContent = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    bubble.appendChild(time);

    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return bubble;
}

function setLoading(loading) {
    sendBtn.disabled = loading;
    chatInput.disabled = loading;
    if (loading) {
        sendBtn.innerHTML = '<div class="loader"></div>';
        chatInput.placeholder = 'AI正在思考中...';
    } else {
        sendBtn.innerHTML = '发送';
        chatInput.placeholder = '输入您的问题...';
    }
}

chatForm.onsubmit = async function(e) {
    e.preventDefault();
    const userMsg = chatInput.value.trim();
    if (!userMsg) return;
    
    appendMessage('user', userMsg);
    messages.push({ role: 'user', content: userMsg });
    chatInput.value = '';
    setLoading(true);

    // 为AI响应创建一个空泡泡
    const aiBubble = appendMessage('ai', '');
    const aiContentElement = aiBubble.querySelector('.bubble-content');
    aiContentElement.textContent = '▋'; // 使用光标作为初始提示

    let fullResponse = '';

    // 新增：用于逐步渲染 markdown
    function renderMarkdownStepwise(mdText) {
        // 先将 markdown 转为 HTML
        const html = marked.parse(mdText);
        aiContentElement.innerHTML = html + '<span class="cursor">▋</span>';
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: messages.slice(-10),
                temperature: 0.7,
                stream: true // 开启流式响应
            })
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`API 请求失败: ${res.status} ${res.statusText} - ${errorText}`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder('utf-8');

        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                break; // 读取完成
            }

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n').filter(line => line.trim().startsWith('data:'));

            for (const line of lines) {
                const data = line.replace(/^data: /, '');
                if (data === '[DONE]') {
                    break;
                }
                try {
                    const json = JSON.parse(data);
                    const content = json.choices[0].delta.content;
                    if (content) {
                        fullResponse += content;
                        renderMarkdownStepwise(fullResponse);
                    }
                } catch (e) {
                    console.error('Error parsing stream data:', data, e);
                }
            }
        }
        
        // 最终渲染 markdown，去掉光标
        aiContentElement.innerHTML = marked.parse(fullResponse);
        messages.push({ role: 'assistant', content: fullResponse });

    } catch (err) {
        console.error(err);
        aiContentElement.textContent = `❌ 请求出错: ${err.message}`;
        aiContentElement.style.color = '#e53e3e';
    } finally {
        setLoading(false);
        chatInput.focus();
    }
};

// 粒子动画
function createParticles() {
    const container = document.getElementById('particlesBg');
    if (!container) return;
    const w = window.innerWidth, h = window.innerHeight;
    for (let i = 0; i < 30; i++) { // 增加粒子数量
        const p = document.createElement('div');
        p.className = 'particle';
        const size = Math.random() * 25 + 10;
        p.style.width = p.style.height = size + 'px';
        p.style.left = Math.random() * (w - size) + 'px';
        p.style.top = Math.random() * (h - size) + 'px';
        p.style.animationDuration = (12 + Math.random() * 10) + 's';
        p.style.animationDelay = (Math.random() * 12) + 's';
        container.appendChild(p);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    createParticles();
    appendMessage('ai', '你好！我是DeepSeek AI助手，专注于环保和碳足迹计算领域。请问有什么可以帮您的吗？');
}); 