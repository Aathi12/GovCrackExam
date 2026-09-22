import re

with open('js/app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

# 1. Fix the accidental topicPractices wipe in calculateDrillResults
buggy_drill_history = """    if (!history.drills) history.drills = [];
        history.topicPractices = [];
    history.drills.unshift({"""

fixed_drill_history = """    if (!history.drills) history.drills = [];
    history.drills.unshift({"""

app_js = app_js.replace(buggy_drill_history, fixed_drill_history)

# 2. Add renderMistakes and escapeHTML functions at the end of the file
render_mistakes_code = """
function renderMistakes(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const mistakes = currentQuiz.filter(q => userAnswers[q.qid] !== q.correctOption);
    
    if (mistakes.length === 0) {
        container.innerHTML = `<h3 style="text-align: center; color: var(--success-color); margin-bottom: 10px;">Perfect! No mistakes to review.</h3>`;
        return;
    }
    
    let html = `<h3 style="margin-bottom: 5px; text-align: center;">Review Mistakes</h3>
                <p style="text-align: center; color: var(--text-muted); margin-bottom: 20px;">${mistakes.length} questions to review</p>`;
    
    mistakes.forEach((q, idx) => {
        const userOptIndex = userAnswers[q.qid] ? userAnswers[q.qid] - 1 : -1;
        const userOptText = userOptIndex >= 0 && userOptIndex < q.options.length ? q.options[userOptIndex] : 'Did not answer';
        
        const correctOptIndex = q.correctOption - 1;
        const correctOptText = correctOptIndex >= 0 && correctOptIndex < q.options.length ? q.options[correctOptIndex] : '';
        
        const safeQ = escapeHTML(q.question);
        const safeUserAns = escapeHTML(userOptText);
        const safeCorrectAns = escapeHTML(correctOptText);
        const safeExplanation = escapeHTML(q.explanation || 'No explanation available.').replace(/\\n/g, '<br>');
        
        html += `
        <div class="mistake-item card" style="margin-bottom: 15px; text-align: left; padding: 15px; background-color: var(--card-bg); border: 1px solid var(--border-color); border-radius: 6px;">
            <p style="font-weight: 600; margin-bottom: 15px;">Q${idx + 1}. ${safeQ}</p>
            
            <div style="margin-bottom: 10px; padding: 10px; background-color: rgba(239, 68, 68, 0.1); border-left: 4px solid var(--danger-color);">
                <p style="font-size: 0.9rem; font-weight: 600; margin-bottom: 5px; color: var(--danger-color);">Your Answer: Option ${userAnswers[q.qid] || '-'}</p>
                <p style="font-size: 0.95rem;">${safeUserAns}</p>
            </div>
            
            <div style="margin-bottom: 15px; padding: 10px; background-color: rgba(16, 185, 129, 0.1); border-left: 4px solid var(--success-color);">
                <p style="font-size: 0.9rem; font-weight: 600; margin-bottom: 5px; color: var(--success-color);">Correct Answer: Option ${q.correctOption}</p>
                <p style="font-size: 0.95rem;">${safeCorrectAns}</p>
            </div>
            
            <div class="explanation-card" style="margin-top: 15px; padding-top: 15px; border-top: 1px solid var(--border-color);">
                <strong>Explanation:</strong><br>${safeExplanation}
            </div>
        </div>
        `;
    });
    
    container.innerHTML = html;
}

function escapeHTML(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
"""

if "function renderMistakes" not in app_js:
    app_js += "\n" + render_mistakes_code

# 3. Call renderMistakes inside calculateDrillResults
drill_accuracy_line = "document.getElementById('drill-accuracy').textContent = `${drillAccuracy}% Accuracy`;"
if "renderMistakes('drill-mistakes-container');" not in app_js:
    app_js = app_js.replace(drill_accuracy_line, drill_accuracy_line + "\n    renderMistakes('drill-mistakes-container');")

# 4. Call renderMistakes inside calculateTopicPracticeResults
topic_accuracy_line = "document.getElementById('topic-practice-accuracy').textContent = `${accuracy}% Accuracy`;"
if "renderMistakes('topic-practice-mistakes-container');" not in app_js:
    app_js = app_js.replace(topic_accuracy_line, topic_accuracy_line + "\n    renderMistakes('topic-practice-mistakes-container');")

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(app_js)

print("Updated app.js")
