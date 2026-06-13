from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

user = {
    "name": "林星途",
    "level": 7,
    "points": 2340,
    "match_score": 73,
    "resume_text": "负责校园公众号运营，撰写推文，策划校园活动，具备良好的沟通能力和团队协作精神。",
    "target_job": "产品运营实习生"
}

jobs = [
    {"id": 1, "company": "字节跳动", "logo": "B", "position": "产品运营实习生", "match": 85, "friendly": True, "salary": "150-200/天"},
    {"id": 2, "company": "腾讯", "logo": "T", "position": "用户运营", "match": 72, "friendly": False, "salary": "180-250/天"},
    {"id": 3, "company": "阿里巴巴", "logo": "A", "position": "内容运营", "match": 68, "friendly": True, "salary": "160-220/天"},
    {"id": 4, "company": "美团", "logo": "M", "position": "社区运营", "match": 78, "friendly": True, "salary": "140-180/天"},
    {"id": 5, "company": "京东", "logo": "J", "position": "活动运营", "match": 65, "friendly": False, "salary": "150-200/天"}
]

tasks = [
    {"id": 1, "title": "完成简历优化", "icon": "edit", "progress": 60, "reward": 50},
    {"id": 2, "title": "模拟面试1次", "icon": "mic", "progress": 0, "reward": 80},
    {"id": 3, "title": "加入搭子小组", "icon": "users", "progress": 0, "reward": 30}
]

resume_analysis = {
    "uniqueness_score": 42,
    "cliches": ["负责...工作", "具备...能力", "团队协作", "沟通能力"],
    "heatmap_data": [
        [0.8, 0.3, 0.5, 0.6, 0.4, 0.7, 0.5, 0.3],
        [0.2, 0.9, 0.4, 0.3, 0.8, 0.5, 0.6, 0.4],
        [0.5, 0.4, 0.7, 0.2, 0.5, 0.9, 0.3, 0.6]
    ]
}

interview_questions = [
    {"question": "请用STAR法则介绍一次你领导团队的经历。", "type": "behavior"},
    {"question": "如果用户留存率下降10%，你会怎么分析？", "type": "case"},
    {"question": "你为什么选择我们公司？", "type": "behavior"},
    {"question": "请举一个你解决过的最有挑战性的问题。", "type": "behavior"},
    {"question": "如何提升产品的用户活跃度？", "type": "case"}
]

partners = [
    {"id": 1, "name": "张宇航", "avatar": "ZYH", "tags": ["产品运营", "应届生", "性格开朗"], "match": 88},
    {"id": 2, "name": "李思琪", "avatar": "LSQ", "tags": ["用户运营", "实习中", "善于沟通"], "match": 76},
    {"id": 3, "name": "王浩然", "avatar": "WHR", "tags": ["内容运营", "应届生", "执行力强"], "match": 82},
    {"id": 4, "name": "陈雨萱", "avatar": "CYX", "tags": ["活动运营", "有经验", "认真负责"], "match": 79}
]

groups = [
    {"id": 1, "name": "产品运营冲刺营", "members": 128, "last_msg": "伴伴：今天的面试题已更新", "unread": 3},
    {"id": 2, "name": "秋招搭子小组", "members": 256, "last_msg": "张宇航：模拟面试安排在今晚8点", "unread": 0}
]

skills = [
    {"id": 1, "name": "产品思维", "level": 3, "max_level": 5, "unlocked": True, "color": "#00F0FF"},
    {"id": 2, "name": "数据分析", "level": 2, "max_level": 5, "unlocked": True, "color": "#B026FF"},
    {"id": 3, "name": "用户研究", "level": 1, "max_level": 5, "unlocked": True, "color": "#FF6B6B"},
    {"id": 4, "name": "竞品分析", "level": 0, "max_level": 5, "unlocked": False, "color": "#4ECDC4"},
    {"id": 5, "name": "活动策划", "level": 2, "max_level": 5, "unlocked": True, "color": "#FFE66D"},
    {"id": 6, "name": "文案写作", "level": 3, "max_level": 5, "unlocked": True, "color": "#95E1D3"}
]

projects = [
    {"id": 1, "name": "SQL入门实战", "level": "L1", "difficulty": "免费", "progress": 0, "skills": ["数据分析"]},
    {"id": 2, "name": "用户画像分析", "level": "L2", "difficulty": "进阶", "progress": 0, "skills": ["用户研究", "数据分析"]},
    {"id": 3, "name": "产品运营方案设计", "level": "L2", "difficulty": "进阶", "progress": 50, "skills": ["产品思维", "活动策划"]},
    {"id": 4, "name": "竞品分析报告", "level": "L3", "difficulty": "高级", "progress": 0, "skills": ["竞品分析", "产品思维"]}
]

portfolio = [
    {"id": 1, "name": "校园公众号运营方案", "type": "方案设计", "date": "2024-03"},
    {"id": 2, "name": "用户调研分析报告", "type": "数据分析", "date": "2024-04"},
    {"id": 3, "name": "活动策划案", "type": "活动策划", "date": "2024-05"}
]


@app.route('/')
def index():
    return render_template('index.html', user=user, jobs=jobs, tasks=tasks)


@app.route('/resume')
def resume():
    return render_template('resume.html', user=user, analysis=resume_analysis)


@app.route('/interview')
def interview():
    return render_template('interview.html', user=user, questions=interview_questions)


@app.route('/partner')
def partner():
    return render_template('partner.html', user=user, partners=partners, groups=groups)


@app.route('/workshop')
def workshop():
    return render_template('workshop.html', user=user, skills=skills, projects=projects, portfolio=portfolio)


@app.route('/profile')
def profile():
    return render_template('profile.html', user=user)


@app.route('/api/analyze_resume', methods=['POST'])
def analyze_resume():
    data = request.get_json()
    text = data.get('text', '')
    cliches_found = []
    cliche_patterns = ["负责", "具备", "团队协作", "沟通能力", "良好的", "熟练掌握"]
    for pattern in cliche_patterns:
        if pattern in text:
            cliches_found.append(pattern + "...")
    
    uniqueness = max(20, min(100, 100 - len(cliches_found) * 15 - len(text) // 50))
    
    return jsonify({
        "uniqueness_score": uniqueness,
        "cliches": cliches_found[:4],
        "heatmap_data": [
            [0.8, 0.3, 0.5, 0.6, 0.4, 0.7, 0.5, 0.3],
            [0.2, 0.9, 0.4, 0.3, 0.8, 0.5, 0.6, 0.4],
            [0.5, 0.4, 0.7, 0.2, 0.5, 0.9, 0.3, 0.6]
        ]
    })


@app.route('/api/get_interview_score', methods=['POST'])
def get_interview_score():
    data = request.get_json()
    answer = data.get('answer', '')
    
    scores = {
        "completeness": min(100, len(answer) * 2),
        "structure": 75 if "首先" in answer and "然后" in answer else 50,
        "matching": 65 + (len(answer) // 30),
        "fluency": min(100, 80 + len(answer) // 50)
    }
    
    suggestion = "回答很完整！建议增加更多具体数据。" if len(answer) > 100 else "建议提供更多具体案例和数据支持。"
    
    return jsonify({"scores": scores, "suggestion": suggestion})


if __name__ == '__main__':
    app.run(debug=True)
