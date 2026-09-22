import re

with open('js/app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

# 1. Add topicPracticeResults to screens
app_js = app_js.replace(
    "drillResults: document.getElementById('drill-results-screen'),\n    progress: document.getElementById('progress-screen')",
    "drillResults: document.getElementById('drill-results-screen'),\n    progress: document.getElementById('progress-screen'),\n    topicPracticeResults: document.getElementById('topic-practice-results-screen')"
)

# 2. Add mode condition to selectOption and renderQuestion
# In selectOption:
app_js = app_js.replace(
    "if (mode === 'drill') {",
    "if (mode === 'drill' || mode === 'topicPractice') {"
)

# In renderQuestion:
app_js = app_js.replace(
    "if (mode === 'drill' && userAnswers[q.qid]) {",
    "if ((mode === 'drill' || mode === 'topicPractice') && userAnswers[q.qid]) {"
)

# 3. Add startTopicPractice() and calculateTopicPracticeResults()
new_functions = """
function startTopicPractice(topic) {
    mode = 'topicPractice';
    drillTopics = [topic];
    
    // Filter strictly by topic
    let topicQuestions = questionsBank.filter(q => q.subtopic === topic);
    
    // Randomize and take up to 10
    topicQuestions = topicQuestions.sort(() => 0.5 - Math.random());
    currentQuiz = topicQuestions.slice(0, 10);
    
    if (currentQuiz.length === 0) {
        alert("No questions found for this topic.");
        return;
    }
    
    quizModeIndicator.textContent = `Practice: ${topic}`;
    currentQuestionIndex = 0;
    userAnswers = {};
    drillFeedback.classList.add('hidden');
    switchScreen('quiz');
    renderQuestion();
}

function calculateTopicPracticeResults() {
    let totalCorrect = 0;
    const attempted = currentQuiz.length;
    currentQuiz.forEach(q => {
        if (userAnswers[q.qid] === q.correctOption) totalCorrect++;
    });

    const accuracy = attempted > 0 ? Math.round((totalCorrect / attempted) * 100) : 0;
    const topic = drillTopics[0];
    
    document.getElementById('topic-practice-name').textContent = topic;
    document.getElementById('topic-practice-score').textContent = `${totalCorrect} / ${attempted} Correct`;
    document.getElementById('topic-practice-accuracy').textContent = `${accuracy}% Accuracy`;
    
    // Save history
    const history = getSavedHistory() || {};
    if (!history.topicPractices) history.topicPractices = [];
    
    history.topicPractices.unshift({
        timestamp: new Date().toISOString(),
        topic: topic,
        score: totalCorrect,
        attempted: attempted,
        accuracy: accuracy
    });
    
    if (history.topicPractices.length > 50) {
        history.topicPractices = history.topicPractices.slice(0, 50);
    }
    saveHistory(history);
}
"""

# Inject before initApp
app_js = app_js.replace("async function initApp() {", new_functions + "\nasync function initApp() {")

# 4. Modify submitQuiz
old_submit = """function submitQuiz() {
    if (mode === 'diagnostic') {
        calculateDiagnosticResults();
        switchScreen('results');
    } else {
        calculateDrillResults();
        switchScreen('drillResults');
    }
}"""

new_submit = """function submitQuiz() {
    if (mode === 'diagnostic') {
        calculateDiagnosticResults();
        switchScreen('results');
    } else if (mode === 'drill') {
        calculateDrillResults();
        switchScreen('drillResults');
    } else if (mode === 'topicPractice') {
        calculateTopicPracticeResults();
        switchScreen('topicPracticeResults');
    }
}"""

app_js = app_js.replace(old_submit, new_submit)

# 5. Connect buttons for Topic Practice in initApp
event_listeners = """
        // Topic practice navigation buttons
        const retakeTopicBtn = document.getElementById('retake-topic-practice-btn');
        if (retakeTopicBtn) retakeTopicBtn.addEventListener('click', () => startTopicPractice(drillTopics[0]));
        const backTopicBtn = document.getElementById('back-topic-btn');
        if (backTopicBtn) backTopicBtn.addEventListener('click', () => {
            let topicSlug = drillTopics[0].toLowerCase().replace(/ /g, '-').replace(/\\//g, '').replace(/--/g, '-');
            window.location.href = topicSlug + '.html';
        });
        const homeTopicBtn = document.getElementById('home-btn-topic-practice');
        if (homeTopicBtn) homeTopicBtn.addEventListener('click', showStartScreen);
        
        // Check URL params
        const urlParams = new URLSearchParams(window.location.search);
        const practiceTopic = urlParams.get('practice');
        if (practiceTopic && questionsBank.length > 0) {
            startTopicPractice(practiceTopic);
        }
"""

app_js = app_js.replace("document.getElementById('reset-progress-btn').addEventListener('click', resetProgress);", "document.getElementById('reset-progress-btn').addEventListener('click', resetProgress);\n" + event_listeners)

# 6. Update Progress Screen (Topic Practice section and topicPractices array)
progress_update_1 = """const drills = history.drills || [];
    const topicPractices = history.topicPractices || [];"""

app_js = app_js.replace("const drills = history.drills || [];", progress_update_1)

# Add topicPractices attempts to the table
app_js = app_js.replace("<th>Topic</th><th>Latest</th><th>Best</th><th>Status</th><th>Drills</th></tr></thead>", "<th>Topic</th><th>Latest</th><th>Best</th><th>Status</th><th>Drills</th><th>Topic Practice</th></tr></thead>")

app_js = app_js.replace("let drillsCompleted = topicDrills.length;", "let drillsCompleted = topicDrills.length;\n        let practicesCompleted = topicPractices.filter(d => d.topic === t).length;")

app_js = app_js.replace("<td>${drillsCompleted}</td>\n            </tr>`;", "<td>${drillsCompleted}</td>\n                <td>${practicesCompleted}</td>\n            </tr>`;")

# Add Topic Practice History section in progress screen
recent_drills_idx = app_js.find("if (drills.length === 0) {")
if recent_drills_idx != -1:
    topic_practices_html = """
    if (topicPractices.length === 0) {
        html += '<p style="text-align: center; color: var(--text-muted); margin-bottom: 30px;">No topic practices completed yet.</p>';
    } else {
        html += '<h3>Recent Topic Practices</h3><div class="progress-table-container"><table class="progress-table"><thead><tr><th>Topic</th><th>Date</th><th>Score</th><th>Accuracy</th></tr></thead><tbody>';
        topicPractices.slice(0, 5).forEach(d => {
            const dateStr = new Date(d.timestamp).toLocaleString();
            html += `<tr>
                <td>${d.topic}</td>
                <td>${dateStr}</td>
                <td>${d.score}/${d.attempted}</td>
                <td>${d.accuracy}%</td>
            </tr>`;
        });
        html += '</tbody></table></div>';
    }
    
    """
    app_js = app_js[:recent_drills_idx] + topic_practices_html + app_js[recent_drills_idx:]

# 7. Update resetProgress() to clear topicPractices
app_js = app_js.replace("history.drills = [];", "history.drills = [];\n        history.topicPractices = [];")

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(app_js)
