import re

with open('js/app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

# 1. Add to screens
app_js = app_js.replace("topicPracticeResults: document.getElementById('topic-practice-results-screen')\n};", "topicPracticeResults: document.getElementById('topic-practice-results-screen'),\n    fullPracticeResults: document.getElementById('full-practice-results-screen')\n};")

# 2. Add event listeners
event_listeners = """        // Event Listeners
        document.getElementById('start-full-practice-btn').addEventListener('click', startFullPractice);
        const retakeFullBtn = document.getElementById('retake-full-practice-btn');
        if (retakeFullBtn) retakeFullBtn.addEventListener('click', startFullPractice);
        const homeFullBtn = document.getElementById('home-btn-full-practice');
        if (homeFullBtn) homeFullBtn.addEventListener('click', showStartScreen);
"""
app_js = app_js.replace('// Event Listeners', event_listeners)

# 3. Update submitQuiz
submit_quiz_old = """    } else if (mode === 'topicPractice') {
        calculateTopicPracticeResults();
        switchScreen('topicPracticeResults');
    }"""
submit_quiz_new = """    } else if (mode === 'topicPractice') {
        calculateTopicPracticeResults();
        switchScreen('topicPracticeResults');
    } else if (mode === 'fullPractice') {
        calculateFullPracticeResults();
        switchScreen('fullPracticeResults');
    }"""
app_js = app_js.replace(submit_quiz_old, submit_quiz_new)

# 4, 5, 6. Add startFullPractice, calculateFullPracticeResults, renderAllAnswers
new_functions = """
function startFullPractice() {
    mode = 'fullPractice';
    userAnswers = {};
    currentQuestionIndex = 0;
    currentQuiz = [...questionsBank].sort(() => 0.5 - Math.random()).slice(0, 20);
    switchScreen('quiz');
    renderQuestion();
}

function calculateFullPracticeResults() {
    let totalCorrect = 0;
    const attempted = currentQuiz.length;
    const topicStats = {};

    currentQuiz.forEach(q => {
        if (!topicStats[q.subtopic]) {
            topicStats[q.subtopic] = { attempted: 0, correct: 0 };
        }
        topicStats[q.subtopic].attempted++;
        
        if (userAnswers[q.qid] === q.correctOption) {
            totalCorrect++;
            topicStats[q.subtopic].correct++;
        }
    });

    const accuracy = attempted > 0 ? Math.round((totalCorrect / attempted) * 100) : 0;
    
    document.getElementById('full-practice-score').textContent = `${totalCorrect} / ${attempted}`;
    document.getElementById('full-practice-accuracy').textContent = `${accuracy}% Accuracy`;
    
    let perfHtml = '<h3 style="margin-bottom: 15px;">Topic Performance</h3><div class="topic-results-container">';
    const allTopics = [
        "Blood Relations",
        "Coded Language",
        "Dictionary Order",
        "Letter-cluster Analogy / Series",
        "Mathematical Operations",
        "Syllogism"
    ];
    
    const topicPerformance = {};
    
    allTopics.forEach(t => {
        if (topicStats[t] && topicStats[t].attempted > 0) {
            const acc = Math.round((topicStats[t].correct / topicStats[t].attempted) * 100);
            topicPerformance[t] = { attempted: topicStats[t].attempted, accuracy: acc, correct: topicStats[t].correct };
            
            perfHtml += `
            <div class="topic-card">
                <div class="topic-header">
                    <span class="topic-title">${t}</span>
                </div>
                <div class="topic-stats">
                    <div class="stat-box">
                        <div class="stat-value">${topicStats[t].correct} / ${topicStats[t].attempted}</div>
                        <div>Score</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-value">${acc}%</div>
                        <div>Accuracy</div>
                    </div>
                </div>
            </div>`;
        } else {
            perfHtml += `
            <div class="topic-card">
                <div class="topic-header">
                    <span class="topic-title">${t}</span>
                </div>
                <div class="topic-stats">
                    <div class="stat-box">
                        <div class="stat-value">N/A</div>
                        <div>Score</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-value">N/A</div>
                        <div>Accuracy</div>
                    </div>
                </div>
            </div>`;
        }
    });
    
    perfHtml += '</div>';
    document.getElementById('full-practice-topic-performance').innerHTML = perfHtml;
    
    const history = getSavedHistory() || {};
    if (!history.fullPractices) history.fullPractices = [];
    
    history.fullPractices.unshift({
        timestamp: new Date().toISOString(),
        score: totalCorrect,
        attempted: attempted,
        accuracy: accuracy,
        topicPerformance: topicPerformance
    });
    
    if (history.fullPractices.length > 50) {
        history.fullPractices = history.fullPractices.slice(0, 50);
    }
    saveHistory(history);
    
    renderMistakes('full-practice-mistakes-container');
    renderAllAnswers('full-practice-review-container');
}

function renderAllAnswers(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    let html = `<h3 style="margin-bottom: 5px; text-align: center;">Review Answers</h3>
                <p style="text-align: center; color: var(--text-muted); margin-bottom: 20px;">All ${currentQuiz.length} questions</p>`;
    
    currentQuiz.forEach((q, idx) => {
        const userOptIndex = userAnswers[q.qid] ? userAnswers[q.qid] - 1 : -1;
        const userOptText = userOptIndex >= 0 && userOptIndex < q.options.length ? q.options[userOptIndex] : 'Did not answer';
        const correctOptIndex = q.correctOption - 1;
        const correctOptText = correctOptIndex >= 0 && correctOptIndex < q.options.length ? q.options[correctOptIndex] : '';
        
        const safeQ = escapeHTML(q.question);
        const safeUserAns = escapeHTML(userOptText);
        const safeCorrectAns = escapeHTML(correctOptText);
        const safeExplanation = escapeHTML(q.explanation || 'No explanation available.').replace(/\\n/g, '<br>');
        
        const isCorrect = userAnswers[q.qid] === q.correctOption;
        const answerStyle = isCorrect ? 
            'background-color: rgba(16, 185, 129, 0.1); border-left: 4px solid var(--success-color);' : 
            'background-color: rgba(239, 68, 68, 0.1); border-left: 4px solid var(--danger-color);';
        const answerColor = isCorrect ? 'color: var(--success-color);' : 'color: var(--danger-color);';
        
        html += `
        <div class="review-item card" style="margin-bottom: 15px; text-align: left; padding: 15px; background-color: var(--bg-card); border: 1px solid var(--border-color); border-radius: 6px;">
            <p style="font-weight: 600; margin-bottom: 15px;">Q${idx + 1}. ${safeQ}</p>
            <div style="margin-bottom: 10px; padding: 10px; ${answerStyle}">
                <p style="font-size: 0.9rem; font-weight: 600; margin-bottom: 5px; ${answerColor}">Your Answer: Option ${userAnswers[q.qid] || '-'}</p>
                <p style="font-size: 0.95rem;">${safeUserAns}</p>
            </div>
            <div style="margin-bottom: 15px; padding: 10px; background-color: rgba(16, 185, 129, 0.1); border-left: 4px solid var(--success-color);">
                <p style="font-size: 0.9rem; font-weight: 600; margin-bottom: 5px; color: var(--success-color);">Correct Answer: Option ${q.correctOption}</p>
                <p style="font-size: 0.95rem;">${safeCorrectAns}</p>
            </div>
            <div class="explanation-card" style="margin-top: 15px; padding-top: 15px; border-top: 1px solid var(--border-color);">
                <strong>Explanation:</strong><br>${safeExplanation}
            </div>
        </div>`;
    });
    
    container.innerHTML = html;
}
"""

if "function startFullPractice" not in app_js:
    app_js += "\n" + new_functions

# 7. Modify showProgressScreen
app_js = app_js.replace("const topicPractices = history.topicPractices || [];", "const topicPractices = history.topicPractices || [];\n    const fullPractices = history.fullPractices || [];")
app_js = app_js.replace("if (diags.length === 0 && drills.length === 0 && topicPractices.length === 0)", "if (diags.length === 0 && drills.length === 0 && topicPractices.length === 0 && fullPractices.length === 0)")

best_drill_str = "let bestDrill = 0;\n    drills.forEach(d => { if(d.accuracy > bestDrill) bestDrill = d.accuracy; });"
best_full_str = best_drill_str + "\n    let bestFull = 0;\n    fullPractices.forEach(d => { if(d.accuracy > bestFull) bestFull = d.accuracy; });"
app_js = app_js.replace(best_drill_str, best_full_str)

stats_str = """            <div class="progress-stat-card">
                <h4>Drill Accuracy</h4>
                <p style="font-size: 0.9rem; margin-top: 5px;">Latest: ${drills.length > 0 ? drills[0].accuracy + '%' : 'N/A'}</p>
                <p style="font-size: 0.9rem; color: var(--text-muted);">Best: ${bestDrill}%</p>
            </div>"""
new_stats_str = stats_str + """
            <div class="progress-stat-card">
                <h4>Full Tests Completed</h4>
                <p>${fullPractices.length}</p>
            </div>
            <div class="progress-stat-card">
                <h4>Full Practice Accuracy</h4>
                <p style="font-size: 0.9rem; margin-top: 5px;">Latest: ${fullPractices.length > 0 ? fullPractices[0].accuracy + '%' : 'N/A'}</p>
                <p style="font-size: 0.9rem; color: var(--text-muted);">Best: ${bestFull}%</p>
            </div>"""
app_js = app_js.replace(stats_str, new_stats_str)

topic_prac_push = """        const topicPracs = topicPractices.filter(d => d.topic === t);
        topicPracs.forEach(d => {
            records.push({ timestamp: new Date(d.timestamp).getTime(), accuracy: d.accuracy });
        });"""
topic_full_push = topic_prac_push + """
        fullPractices.forEach(d => {
            const td = d.topicPerformance && d.topicPerformance[t];
            if (td && td.attempted > 0) {
                records.push({ timestamp: new Date(d.timestamp).getTime(), accuracy: td.accuracy });
            }
        });"""
app_js = app_js.replace(topic_prac_push, topic_full_push)

recent_drills_str = """    if (drills.length === 0) {
        html += `<p style="text-align: center; color: var(--text-muted); margin-bottom: 30px;">No drills completed yet.</p>`;
    }"""
recent_full_str = """
    if (fullPractices.length > 0) {
        html += `<h3>Recent Full Practices</h3>
        <div class="progress-table-container">
        <table class="progress-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Score</th>
                    <th>Accuracy</th>
                </tr>
            </thead>
            <tbody>`;
        
        fullPractices.slice(0, 5).forEach(d => {
            const dateStr = new Date(d.timestamp).toLocaleString();
            html += `<tr>
                <td>${dateStr}</td>
                <td>${d.score}/${d.attempted}</td>
                <td>${d.accuracy}%</td>
            </tr>`;
        });
        
        html += `</tbody></table></div>`;
    }
"""
app_js = app_js.replace(recent_drills_str, recent_full_str + "\n" + recent_drills_str)

# 8. Modify resetProgress
app_js = app_js.replace("history.topicPractices = [];", "history.topicPractices = [];\n        history.fullPractices = [];")

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(app_js)

print("Updated app.js")
