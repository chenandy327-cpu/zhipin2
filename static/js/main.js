function createStarsBackground() {
    const canvas = document.getElementById('stars-bg');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationId;
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resize();
    window.addEventListener('resize', resize);
    
    const stars = [];
    for (let i = 0; i < 150; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.5 + 0.5,
            opacity: Math.random(),
            twinkleSpeed: Math.random() * 0.02 + 0.01
        });
    }
    
    function animate() {
        ctx.fillStyle = 'rgba(3, 6, 20, 1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        stars.forEach(star => {
            star.opacity += star.twinkleSpeed;
            if (star.opacity >= 1 || star.opacity <= 0.2) {
                star.twinkleSpeed = -star.twinkleSpeed;
            }
            
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            ctx.fill();
        });
        
        animationId = requestAnimationFrame(animate);
    }
    
    animate();
    
    return () => {
        cancelAnimationFrame(animationId);
        window.removeEventListener('resize', resize);
    };
}

function drawProgressRing(containerId, percentage, color1 = '#00F0FF', color2 = '#B026FF') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const size = 120;
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;
    
    const svg = `
        <svg width="${size}" height="${size}" class="progress-ring">
            <circle
                class="progress-ring-circle"
                stroke="rgba(255,255,255,0.1)"
                fill="transparent"
                stroke-width="${strokeWidth}"
                r="${radius}"
                cx="${size / 2}"
                cy="${size / 2}"
            />
            <circle
                class="progress-ring-circle"
                stroke="url(#gradient-${containerId})"
                fill="transparent"
                stroke-width="${strokeWidth}"
                stroke-linecap="round"
                r="${radius}"
                cx="${size / 2}"
                cy="${size / 2}"
                stroke-dasharray="${circumference}"
                stroke-dashoffset="${offset}"
            />
            <defs>
                <linearGradient id="gradient-${containerId}" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="${color1}" />
                    <stop offset="100%" stop-color="${color2}" />
                </linearGradient>
            </defs>
        </svg>
        <div class="progress-ring-text">
            <div class="progress-ring-value">${percentage}%</div>
            <div class="progress-ring-label">匹配度</div>
        </div>
    `;
    
    container.innerHTML = svg;
}

function drawHeatmap(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    let html = '<div class="heatmap-grid">';
    data.forEach((row, rowIndex) => {
        row.forEach((value, colIndex) => {
            const color = getHeatmapColor(value);
            html += `<div 
                class="heatmap-cell" 
                style="background: ${color}"
                onclick="showHeatmapInfo(${rowIndex}, ${colIndex}, ${value})"
            ></div>`;
        });
    });
    html += '</div>';
    html += `
        <div class="heatmap-legend">
            <div class="legend-item">
                <div class="legend-color" style="background: rgba(255, 107, 107, 0.8)"></div>
                <span>高关注</span>
            </div>
            <div class="legend-item">
                <div class="legend-color" style="background: rgba(255, 230, 109, 0.5)"></div>
                <span>中关注</span>
            </div>
            <div class="legend-item">
                <div class="legend-color" style="background: rgba(78, 205, 196, 0.3)"></div>
                <span>低关注</span>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

function getHeatmapColor(value) {
    if (value > 0.7) return `rgba(255, 107, 107, ${0.5 + value * 0.5})`;
    if (value > 0.4) return `rgba(255, 230, 109, ${0.3 + value * 0.4})`;
    return `rgba(78, 205, 196, ${0.2 + value * 0.3})`;
}

function showHeatmapInfo(row, col, value) {
    const readTime = Math.round(value * 30);
    alert(`区域 (${row + 1}, ${col + 1})\nHR阅读时间: ${readTime}秒\n关注度: ${Math.round(value * 100)}%`);
}

function drawRadarChart(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const labels = ['完整性', '结构化', '匹配度', '流畅度'];
    const values = [data.completeness, data.structure, data.matching, data.fluency];
    
    const size = 200;
    const center = size / 2;
    const maxRadius = 70;
    const sides = 4;
    const angleStep = (Math.PI * 2) / sides;
    
    let svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`;
    
    for (let level = 5; level >= 1; level--) {
        const radius = (maxRadius * level) / 5;
        svg += '<polygon points="';
        for (let i = 0; i < sides; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const x = center + radius * Math.cos(angle);
            const y = center + radius * Math.sin(angle);
            svg += `${x},${y} `;
        }
        svg += `" fill="none" stroke="rgba(255,255,255,0.${level * 0.1})" stroke-width="1"/>`;
    }
    
    for (let i = 0; i < sides; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const x = center + maxRadius * Math.cos(angle);
        const y = center + maxRadius * Math.sin(angle);
        svg += `<line x1="${center}" y1="${center}" x2="${x}" y2="${y}" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>`;
    }
    
    svg += '<polygon points="';
    values.forEach((value, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const radius = (maxRadius * value) / 100;
        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);
        svg += `${x},${y} `;
    });
    svg += `" fill="url(#radarGradient)" opacity="0.3"/>`;
    
    svg += '<polygon points="';
    values.forEach((value, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const radius = (maxRadius * value) / 100;
        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);
        svg += `${x},${y} `;
    });
    svg += `" fill="none" stroke="url(#radarGradient)" stroke-width="2"/>`;
    
    values.forEach((value, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const radius = (maxRadius * value) / 100;
        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);
        svg += `<circle cx="${x}" cy="${y}" r="4" fill="#00F0FF"/>`;
    });
    
    labels.forEach((label, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const radius = maxRadius + 20;
        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);
        svg += `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" fill="rgba(255,255,255,0.7)" font-size="11">${label}</text>`;
    });
    
    svg += `
        <defs>
            <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#00F0FF"/>
                <stop offset="100%" stop-color="#B026FF"/>
            </linearGradient>
        </defs>
    </svg>`;
    
    container.innerHTML = svg;
}

function initResumeAnalyzer() {
    const textarea = document.getElementById('resume-text');
    const scoreDisplay = document.getElementById('uniqueness-score');
    const clichesList = document.getElementById('cliches-list');
    const heatmapContainer = document.getElementById('heatmap-container');
    
    if (!textarea) return;
    
    textarea.addEventListener('input', debounce(async () => {
        const response = await fetch('/api/analyze_resume', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: textarea.value })
        });
        
        const data = await response.json();
        
        animateScore(scoreDisplay, data.uniqueness_score);
        
        clichesList.innerHTML = data.cliches.map(cliche => 
            `<span class="cliche-tag" onclick="showRewriteSuggestion('${cliche}')">${cliche}</span>`
        ).join('');
        
        drawHeatmap('heatmap-container', data.heatmap_data);
    }, 500));
}

function animateScore(element, targetScore) {
    if (!element) return;
    const currentScore = parseInt(element.textContent) || 0;
    const duration = 500;
    const startTime = Date.now();
    
    function update() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(currentScore + (targetScore - currentScore) * eased);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    update();
}

function showRewriteSuggestion(cliche) {
    const suggestions = {
        '负责...': '建议替换为具体成果，例如"主导XX项目，实现XX目标"',
        '具备...': '建议用具体经历证明能力，例如"通过XX项目展现了XX能力"',
        '团队协作': '建议描述具体的团队协作经历和成果',
        '沟通能力': '建议举例说明如何通过沟通解决问题'
    };
    
    const suggestion = suggestions[cliche.split('...')[0] + '...'] || '点击"深度改写"获取AI改写建议';
    alert(`"${cliche}"\n\n改写建议：\n${suggestion}`);
}

function initSpeechRecognition() {
    const speechBtn = document.getElementById('speech-btn');
    const answerInput = document.getElementById('answer-input');
    const waveform = document.getElementById('waveform');
    
    if (!speechBtn || !('webkitSpeechRecognition' in window)) return;
    
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'zh-CN';
    
    speechBtn.addEventListener('mousedown', () => {
        speechBtn.classList.add('recording');
        if (waveform) waveform.style.display = 'block';
        recognition.start();
    });
    
    speechBtn.addEventListener('mouseup', () => {
        speechBtn.classList.remove('recording');
        if (waveform) waveform.style.display = 'none';
        recognition.stop();
    });
    
    speechBtn.addEventListener('mouseleave', () => {
        speechBtn.classList.remove('recording');
        if (waveform) waveform.style.display = 'none';
        recognition.stop();
    });
    
    recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
        }
        answerInput.value = transcript;
    };
}

function submitAnswer() {
    const answerInput = document.getElementById('answer-input');
    const suggestionBox = document.getElementById('suggestion-box');
    const radarContainer = document.getElementById('radar-container');
    
    if (!answerInput.value.trim()) return;
    
    fetch('/api/get_interview_score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer: answerInput.value })
    })
    .then(response => response.json())
    .then(data => {
        drawRadarChart('radar-container', data.scores);
        if (suggestionBox) {
            suggestionBox.textContent = data.suggestion;
            suggestionBox.style.display = 'block';
        }
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            const page = item.dataset.page;
            if (page) {
                window.location.href = `/${page === 'index' ? '' : page}`;
            }
        });
    });
}

function initModal(modalId, triggerId, closeId) {
    const modal = document.getElementById(modalId);
    const trigger = document.getElementById(triggerId);
    const close = document.getElementById(closeId);
    
    if (!modal || !trigger) return;
    
    trigger.addEventListener('click', () => modal.classList.add('active'));
    
    if (close) {
        close.addEventListener('click', () => modal.classList.remove('active'));
    }
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    createStarsBackground();
    initNavigation();
    
    drawProgressRing('match-ring', 73);
    
    initResumeAnalyzer();
    initSpeechRecognition();
    
    initModal('rewrite-modal', 'rewrite-btn', 'close-rewrite');
    initModal('report-modal', 'end-interview', 'close-report');
    
    drawRadarChart('radar-container', { completeness: 0, structure: 0, matching: 0, fluency: 0 });
    
    drawHeatmap('heatmap-container', [
        [0.8, 0.3, 0.5, 0.6, 0.4, 0.7, 0.5, 0.3],
        [0.2, 0.9, 0.4, 0.3, 0.8, 0.5, 0.6, 0.4],
        [0.5, 0.4, 0.7, 0.2, 0.5, 0.9, 0.3, 0.6]
    ]);
});
