const STORAGE_KEY = 'govcrackexam-drill-v1';

// State variables
let questionsBank = [];
let frequencyData = {};
let metadata = {};

let currentQuiz = [];
let currentQuestionIndex = 0;
let userAnswers = {}; // key: question ID, value: selected option (1-4)
let mode = 'diagnostic'; // 'diagnostic' or 'drill'
let drillTopics = []; // Topics selected for drill

// DOM Elements
const screens = {
    start: document.getElementById('start-screen'),
    quiz: document.getElementById('quiz-screen'),
    results: document.getElementById('results-screen'),
    drillResults: document.getElementById('drill-results-screen'),
    progress: document.getElementById('progress-screen'),
    topicPracticeResults: document.getElementById('topic-practice-results-screen')
};

// Start Screen elements
const startDiagnosticBtn = document.getElementById('start-diagnostic-btn');
const historySection = document.getElementById('history-section');
const viewHistoryBtn = document.getElementById('view-history-btn');
const clearHistoryBtn = document.getElementById('clear-history-btn');

// Quiz Screen elements
const quizTopicTitle = document.getElementById('quiz-topic-title');
const quizProgress = document.getElementById('quiz-progress');
const quizModeIndicator = document.getElementById('quiz-mode-indicator');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const submitBtn = document.getElementById('submit-btn');
const drillFeedback = document.getElementById('drill-feedback');
const feedbackText = document.getElementById('feedback-text');
const feedbackExplanation = document.getElementById('feedback-explanation');

// Initialize App

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

async function initApp() {
    try {
        // Load JSON data
        const [qRes, fRes, mRes] = await Promise.all([
            fetch('data/questions.json').catch(() => ({ ok: false })),
            fetch('data/frequency.json').catch(() => ({ ok: false })),
            fetch('data/metadata.json').catch(() => ({ ok: false }))
        ]);

        if (qRes.ok) questionsBank = await qRes.json();
        if (fRes.ok) frequencyData = await fRes.json();
        if (mRes.ok) metadata = await mRes.json();

        // Populate dynamic topics list
        const topicsList = document.getElementById('pilot-topics-list');
        if (topicsList && questionsBank.length > 0) {
            const uniqueTopics = [...new Set(questionsBank.map(q => q.subtopic))].sort();
            topicsList.innerHTML = '';
            uniqueTopics.forEach(t => {
                const li = document.createElement('li');
                li.textContent = t;
                topicsList.appendChild(li);
            });
        }

        // Check local storage for history
        checkHistory();

        // Event Listeners
        startDiagnosticBtn.addEventListener('click', startDiagnostic);
        viewHistoryBtn.addEventListener('click', showResultsScreen);
        clearHistoryBtn.addEventListener('click', clearHistory);
        prevBtn.addEventListener('click', goPrevious);
        nextBtn.addEventListener('click', goNext);
        submitBtn.addEventListener('click', submitQuiz);
        
        document.getElementById('start-drill-btn').addEventListener('click', startDrill);
        document.getElementById('home-btn').addEventListener('click', showStartScreen);
        
        // New drill navigation buttons
        document.getElementById('retake-drill-btn').addEventListener('click', startDrill);
        document.getElementById('back-diagnostic-btn').addEventListener('click', startDiagnostic);
        document.getElementById('home-btn-drill').addEventListener('click', showStartScreen);
        
        // Progress tracking buttons
        document.getElementById('view-progress-btn').addEventListener('click', showProgressScreen);
        document.getElementById('home-btn-progress').addEventListener('click', showStartScreen);
        document.getElementById('reset-progress-btn').addEventListener('click', resetProgress);

        // Topic practice navigation buttons
        const retakeTopicBtn = document.getElementById('retake-topic-practice-btn');
        if (retakeTopicBtn) retakeTopicBtn.addEventListener('click', () => startTopicPractice(drillTopics[0]));
        const backTopicBtn = document.getElementById('back-topic-btn');
        if (backTopicBtn) backTopicBtn.addEventListener('click', () => {
            let topicSlug = drillTopics[0].toLowerCase().replace(/ /g, '-').replace(/\//g, '').replace(/--/g, '-');
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


    } catch (error) {
        console.error("Error loading application data:", error);
        questionText.textContent = "Error loading data. Make sure you are running via a local server.";
    }
}

// History Management
function getSavedHistory() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
}

function saveHistory(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function checkHistory() {
    const history = getSavedHistory();
    if (history && history.diagnosticResults) {
        historySection.style.display = 'block';
    } else {
        historySection.style.display = 'none';
    }
}

function clearHistory() {
    if(confirm("Are you sure you want to clear your progress history?")) {
        localStorage.removeItem(STORAGE_KEY);
        checkHistory();
        alert("History cleared.");
    }
}

// Navigation
function switchScreen(screenId) {
    Object.values(screens).forEach(screen => screen.classList.remove('active'));
    screens[screenId].classList.add('active');
}

function showStartScreen() {
    checkHistory();
    switchScreen('start');
}

// Quiz Logic
function startDiagnostic() {
    if (questionsBank.length === 0) {
        alert("No verified questions available in the question bank.");
        return;
    }
    mode = 'diagnostic';
    quizModeIndicator.textContent = "Diagnostic Mode";
    drillFeedback.classList.add('hidden');
    
    // Select ~15 questions distributed across subtopics
    currentQuiz = selectDiagnosticQuestions(15);
    if(currentQuiz.length === 0) {
        alert("Not enough questions to start diagnostic.");
        return;
    }
    
    currentQuestionIndex = 0;
    userAnswers = {};
    switchScreen('quiz');
    renderQuestion();
}

function selectDiagnosticQuestions(count) {
    // Group by subtopic
    const byTopic = {};
    questionsBank.forEach(q => {
        if (!byTopic[q.subtopic]) byTopic[q.subtopic] = [];
        byTopic[q.subtopic].push(q);
    });

    // Shuffle topics so we don't always bias alphabetical ones if topics > count
    const topics = Object.keys(byTopic).sort(() => 0.5 - Math.random());
    let selected = [];
    
    // Distribute evenly
    const perTopic = Math.floor(count / topics.length);
    
    if (perTopic > 0) {
        topics.forEach(topic => {
            const shuffled = [...byTopic[topic]].sort(() => 0.5 - Math.random());
            selected = selected.concat(shuffled.slice(0, perTopic));
        });
    }

    // Fill remaining if needed (or if topics > count)
    if (selected.length < count) {
        const remaining = questionsBank.filter(q => !selected.includes(q)).sort(() => 0.5 - Math.random());
        selected = selected.concat(remaining.slice(0, count - selected.length));
    }

    // Shuffle final quiz
    return selected.slice(0, count).sort(() => 0.5 - Math.random());
}

function renderQuestion() {
    const q = currentQuiz[currentQuestionIndex];
    quizProgress.textContent = `Question ${currentQuestionIndex + 1} / ${currentQuiz.length}`;
    questionText.textContent = q.question;
    
    optionsContainer.innerHTML = '';
    
    q.options.forEach((optText, index) => {
        const optNum = index + 1;
        const btn = document.createElement('button');
        btn.className = 'option';
        btn.textContent = `${optNum}. ${optText}`;
        
        if (userAnswers[q.qid] === optNum) {
            btn.classList.add('selected');
        }
        
        // If drill mode and already answered, show feedback and disable
        if ((mode === 'drill' || mode === 'topicPractice') && userAnswers[q.qid]) {
            btn.disabled = true;
            if (optNum === q.correctOption) {
                btn.classList.add('correct');
            } else if (userAnswers[q.qid] === optNum) {
                btn.classList.add('wrong');
            }
        } else {
            btn.onclick = () => selectOption(optNum);
        }
        
        optionsContainer.appendChild(btn);
    });
    
    // Update navigation buttons
    prevBtn.disabled = currentQuestionIndex === 0;
    
    if (currentQuestionIndex === currentQuiz.length - 1) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'block';
    } else {
        nextBtn.style.display = 'block';
        submitBtn.style.display = 'none';
    }

    // Show drill feedback if applicable
    if ((mode === 'drill' || mode === 'topicPractice') && userAnswers[q.qid]) {
        showDrillFeedback(q);
    } else {
        drillFeedback.classList.add('hidden');
    }
}

function selectOption(optNum) {
    if (mode === 'drill' || mode === 'topicPractice') {
        // Immediate feedback
        userAnswers[currentQuiz[currentQuestionIndex].qid] = optNum;
        renderQuestion();
    } else {
        // Just select visually
        userAnswers[currentQuiz[currentQuestionIndex].qid] = optNum;
        const btns = optionsContainer.querySelectorAll('.option');
        btns.forEach(b => b.classList.remove('selected'));
        btns[optNum - 1].classList.add('selected');
    }
}

function showDrillFeedback(q) {
    drillFeedback.classList.remove('hidden', 'correct', 'wrong');
    const isCorrect = userAnswers[q.qid] === q.correctOption;
    
    if (isCorrect) {
        drillFeedback.classList.add('correct');
    } else {
        drillFeedback.classList.add('wrong');
    }
    
    feedbackText.innerHTML = `Your Answer: Option ${userAnswers[q.qid]}<br>Correct Answer: Option ${q.correctOption}`;
    feedbackText.style.color = "inherit";
    
    feedbackExplanation.innerHTML = `<div class="explanation-card"><strong>Explanation:</strong><br>${q.explanation || "Explanation requires review"}</div>`;
}

function goNext() {
    if (currentQuestionIndex < currentQuiz.length - 1) {
        currentQuestionIndex++;
        renderQuestion();
    }
}

function goPrevious() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion();
    }
}

function submitQuiz() {
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
}

// Scoring Logic
function calculateDiagnosticResults() {
    let totalCorrect = 0;
    const topicStats = {};

    currentQuiz.forEach(q => {
        if (!topicStats[q.subtopic]) {
            topicStats[q.subtopic] = { total: 0, correct: 0 };
        }
        topicStats[q.subtopic].total++;
        
        if (userAnswers[q.qid] === q.correctOption) {
            topicStats[q.subtopic].correct++;
            totalCorrect++;
        }
    });

    const overallAccuracy = Math.round((totalCorrect / currentQuiz.length) * 100) || 0;
    
    const results = {
        totalQuestions: currentQuiz.length,
        totalCorrect,
        overallAccuracy,
        topics: {}
    };

    // Calculate priority scores
    Object.keys(topicStats).forEach(topic => {
        const stats = topicStats[topic];
        const accuracy = stats.total > 0 ? stats.correct / stats.total : 0;
        const weakness = 1 - accuracy;
        const weight = frequencyData[topic]?.frequencyWeight || 1.0;
        const priorityScore = weakness * weight;
        
        results.topics[topic] = {
            attempted: stats.total,
            correct: stats.correct,
            accuracy: Math.round(accuracy * 100),
            weakness: Math.round(weakness * 100),
            weight: weight,
            priorityScore: priorityScore.toFixed(2)
        };
    });

    // Save to local storage
    const history = getSavedHistory() || {};
    history.diagnosticResults = results;
    
    if (!history.diagnostics) history.diagnostics = [];
    history.diagnostics.unshift({
        timestamp: new Date().toISOString(),
        score: results.totalCorrect,
        attempted: results.totalQuestions,
        accuracy: results.overallAccuracy,
        topicPerformance: JSON.parse(JSON.stringify(results.topics))
    });
    
    if (history.diagnostics.length > 20) {
        history.diagnostics = history.diagnostics.slice(0, 20);
    }
    
    saveHistory(history);

    renderResultsScreen(results);
}

function renderResultsScreen(results) {
    document.getElementById('overall-score').textContent = `${results.totalCorrect} / ${results.totalQuestions} Correct`;
    document.getElementById('overall-accuracy').textContent = `${results.overallAccuracy}% Accuracy`;

    const container = document.getElementById('topic-results');
    container.innerHTML = '<p class="transparency-note"><em>Performance is based on the number of questions attempted in this diagnostic.</em></p>';

    // Sort topics by priority score descending
    const sortedTopics = Object.entries(results.topics).sort((a, b) => b[1].priorityScore - a[1].priorityScore);
    
    // Determine highest priority for drill
    let highestPriorityScore = -1;
    if (sortedTopics.length > 0) {
        highestPriorityScore = parseFloat(sortedTopics[0][1].priorityScore);
    }

    sortedTopics.forEach(([topic, data], index) => {
        const isHighest = highestPriorityScore > 0 && parseFloat(data.priorityScore) === highestPriorityScore;
        
        let perfLabel = 'Not Attempted';
        let perfClass = 'badge-neutral';
        if (data.attempted > 0) {
            if (data.accuracy > 75) {
                perfLabel = 'Stronger Area';
                perfClass = 'badge-good';
            } else if (data.accuracy > 50) {
                perfLabel = 'Developing';
                perfClass = 'badge-warn';
            } else {
                perfLabel = 'Needs Practice';
                perfClass = 'badge-bad';
            }
        }
        
        const card = document.createElement('div');
        card.className = `topic-card ${isHighest ? 'high-priority' : 'low-priority'}`;
        
        const highestBadge = isHighest ? `<span class="topic-priority-badge badge-high">Highest Priority</span>` : '';
        
        card.innerHTML = `
            <div class="topic-header">
                <span class="topic-title">${topic}</span>
                <div class="badges-container">
                    ${highestBadge}
                    <span class="performance-badge ${perfClass}">${perfLabel}</span>
                </div>
            </div>
            <div class="topic-stats">
                <div class="stat-box">
                    <div class="stat-value">${data.correct} / ${data.attempted}</div>
                    <div>Score</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value">${data.accuracy}%</div>
                    <div>Accuracy</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value">${data.weakness}%</div>
                    <div>Weakness</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value">${data.weight}</div>
                    <div>Freq Weight</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value">${data.priorityScore}</div>
                    <div>Priority Score</div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });

    const reviewContainer = document.getElementById('diagnostic-review');
    reviewContainer.innerHTML = '<h3>Review Answers</h3>';
    
    currentQuiz.forEach((q, index) => {
        const userAnswer = userAnswers[q.qid];
        const isCorrect = userAnswer === q.correctOption;
        
        const reviewCard = document.createElement('div');
        reviewCard.className = 'review-item';
        
        let answerHTML = '';
        if (userAnswer) {
            answerHTML = `<div class="review-answers">
                <div>Your Answer: Option ${userAnswer} <span class="${isCorrect ? 'review-correct' : 'review-incorrect'}">${isCorrect ? '(Correct)' : '(Incorrect)'}</span></div>
                <div>Correct Answer: Option ${q.correctOption}</div>
            </div>`;
        } else {
            answerHTML = `<div class="review-answers">
                <div>Your Answer: Not Attempted</div>
                <div>Correct Answer: Option ${q.correctOption}</div>
            </div>`;
        }
        
        reviewCard.innerHTML = `
            <div class="review-question">Q${index + 1}. ${q.question}</div>
            ${answerHTML}
            <div class="explanation-card">
                <strong>Explanation:</strong><br>
                ${q.explanation || "Explanation requires review"}
            </div>
        `;
        reviewContainer.appendChild(reviewCard);
    });
}

function showResultsScreen() {
    const history = getSavedHistory();
    if (history && history.diagnosticResults) {
        renderResultsScreen(history.diagnosticResults);
        switchScreen('results');
    } else {
        alert("No history found.");
    }
}

// Drill Logic
function startDrill() {
    const history = getSavedHistory();
    if (!history || !history.diagnosticResults) return;

    // Find highest priority topic(s)
    const sortedTopics = Object.entries(history.diagnosticResults.topics)
        .sort((a, b) => b[1].priorityScore - a[1].priorityScore);
        
    if (sortedTopics.length === 0 || sortedTopics[0][1].priorityScore == 0) {
        alert("You have 100% accuracy in all topics! No weak topics to drill.");
        return;
    }

    // Pick topics that have the highest score (could be tie)
    const maxScore = sortedTopics[0][1].priorityScore;
    drillTopics = sortedTopics.filter(t => t[1].priorityScore === maxScore).map(t => t[0]);
    
    // Select drill questions
    currentQuiz = selectDrillQuestions(10, drillTopics);
    
    if (currentQuiz.length === 0) {
        alert("No remaining questions available for your weak topics.");
        return;
    }

    mode = 'drill';
    quizModeIndicator.textContent = `Drill Mode: ${drillTopics.join(', ')}`;
    currentQuestionIndex = 0;
    userAnswers = {};
    switchScreen('quiz');
    renderQuestion();
}

function selectDrillQuestions(count, topics) {
    const history = getSavedHistory();
    const previouslySeen = new Set();
    // In a real app we might track all seen questions. For this pilot, 
    // we'll just try to pick questions from the weak topics.
    
    let pool = questionsBank.filter(q => topics.includes(q.subtopic));
    pool = pool.sort(() => 0.5 - Math.random());
    return pool.slice(0, count);
}

function calculateDrillResults() {
    let totalCorrect = 0;
    const attempted = currentQuiz.length;
    currentQuiz.forEach(q => {
        if (userAnswers[q.qid] === q.correctOption) totalCorrect++;
    });

    const drillAccuracy = attempted > 0 ? Math.round((totalCorrect / attempted) * 100) : 0;
    
    document.getElementById('drill-topic-name').textContent = drillTopics.join(', ');
    document.getElementById('drill-score').textContent = `${totalCorrect} / ${attempted} Correct`;
    document.getElementById('drill-accuracy').textContent = `${drillAccuracy}% Accuracy`;
    
    // Diagnostic Comparison
    const comparisonContainer = document.getElementById('drill-comparison');
    const history = getSavedHistory();
    
    if (!history || !history.diagnosticResults || drillTopics.length === 0) {
        comparisonContainer.innerHTML = '<div>Diagnostic comparison unavailable.</div>';
        return;
    }
    
    // Get diagnostic accuracy for the first drill topic (simplification for single topic drills)
    const primaryTopic = drillTopics[0];
    const diagnosticData = history.diagnosticResults.topics[primaryTopic];
    
    if (!diagnosticData || diagnosticData.attempted === 0) {
        comparisonContainer.innerHTML = '<div>No diagnostic result available for this topic.</div>';
        return;
    }
    
    const diagnosticAccuracy = diagnosticData.accuracy;
    const change = drillAccuracy - diagnosticAccuracy;
    
    let changeClass = 'change-neutral';
    let sign = '';
    
    if (change > 0) {
        changeClass = 'change-positive';
        sign = '+';
    } else if (change < 0) {
        changeClass = 'change-negative';
    }
    
    comparisonContainer.innerHTML = `
        <div>Diagnostic Accuracy: ${diagnosticAccuracy}%</div>
        <div>Drill Accuracy: ${drillAccuracy}%</div>
        <div class="${changeClass}">Change: ${sign}${change} percentage points</div>
    `;

    // Save drill history
    if (!history.drills) history.drills = [];
        history.topicPractices = [];
    history.drills.unshift({
        timestamp: new Date().toISOString(),
        topic: primaryTopic,
        score: totalCorrect,
        attempted: attempted,
        accuracy: drillAccuracy,
        diagnosticAccuracy: diagnosticAccuracy,
        change: change
    });
    
    if (history.drills.length > 50) {
        history.drills = history.drills.slice(0, 50);
    }
    
    saveHistory(history);
}

// Run init
window.addEventListener('DOMContentLoaded', initApp);

// Progress Screen Logic
function showProgressScreen() {
    const history = getSavedHistory() || {};
    const diags = history.diagnostics || [];
    const drills = history.drills || [];
    const topicPractices = history.topicPractices || [];
    
    const content = document.getElementById('progress-content');
    
    if (diags.length === 0) {
        content.innerHTML = '<div class="empty-state" style="text-align: center; padding: 40px 20px;">' +
            '<h3 style="margin-bottom: 15px;">No progress yet</h3>' +
            '<p style="color: var(--text-muted);">Complete your first diagnostic to start tracking your progress.</p>' +
            '</div>';
        switchScreen('progress');
        return;
    }
    
    let bestDiag = 0;
    diags.forEach(d => { if(d.accuracy > bestDiag) bestDiag = d.accuracy; });
    
    let bestDrill = 0;
    drills.forEach(d => { if(d.accuracy > bestDrill) bestDrill = d.accuracy; });
    
    let html = `
        <div class="progress-summary">
            <div class="progress-stat-card">
                <h4>Diagnostics Completed</h4>
                <p>${diags.length}</p>
            </div>
            <div class="progress-stat-card">
                <h4>Drills Completed</h4>
                <p>${drills.length}</p>
            </div>
            <div class="progress-stat-card">
                <h4>Diagnostic Accuracy</h4>
                <p style="font-size: 0.9rem; margin-top: 5px;">Latest: ${diags[0].accuracy}%</p>
                <p style="font-size: 0.9rem; color: var(--text-muted);">Best: ${bestDiag}%</p>
            </div>
            <div class="progress-stat-card">
                <h4>Drill Accuracy</h4>
                <p style="font-size: 0.9rem; margin-top: 5px;">Latest: ${drills.length > 0 ? drills[0].accuracy + '%' : 'N/A'}</p>
                <p style="font-size: 0.9rem; color: var(--text-muted);">Best: ${drills.length > 0 ? bestDrill + '%' : 'N/A'}</p>
            </div>
        </div>
        
        <h3>Topic Progress</h3>
    `;
    
    // Topic performance logic
    const topics = [
        'Blood Relations', 'Coded Language', 'Dictionary Order', 
        'Letter-cluster Analogy / Series', 'Mathematical Operations', 'Syllogism'
    ];
    
    html += '<div class="progress-table-container"><table class="progress-table"><thead><tr><th>Topic</th><th>Latest</th><th>Best</th><th>Status</th><th>Drills</th><th>Topic Practice</th></tr></thead><tbody>';
    
    topics.forEach(t => {
        const allAccs = [];
        const topicDiags = diags.map(d => d.topicPerformance[t]).filter(Boolean).reverse();
        topicDiags.forEach(td => { if(td.attempted > 0) allAccs.push(td.accuracy); });
        
        const topicDrills = drills.filter(d => d.topic === t).reverse();
        topicDrills.forEach(td => allAccs.push(td.accuracy));
        
        let drillsCompleted = topicDrills.length;
        let practicesCompleted = topicPractices.filter(d => d.topic === t).length;
        
        if (allAccs.length > 0) {
            const latest = allAccs[allAccs.length - 1];
            const best = Math.max(...allAccs);
            
            let statusHTML = '<span class="change-neutral">No Change</span>';
            if (allAccs.length >= 2) {
                const prev = allAccs[allAccs.length - 2];
                if (latest > prev) {
                    statusHTML = '<span class="change-positive">Improved</span>';
                } else if (latest < prev) {
                    statusHTML = '<span class="change-negative">Needs More Practice</span>';
                }
            } else {
                statusHTML = '<span class="change-neutral">-</span>';
            }
            
            html += `<tr>
                <td>${t}</td>
                <td>${latest}%</td>
                <td>${best}%</td>
                <td>${statusHTML}</td>
                <td>${drillsCompleted}</td>
                <td>${practicesCompleted}</td>
            </tr>`;
        }
    });
    
    html += '</tbody></table></div>';
    
    
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
    
    if (drills.length === 0) {
        html += '<p style="text-align: center; color: var(--text-muted); margin-bottom: 30px;">No drills completed yet.</p>';
    } else {
        html += '<h3>Recent Drills</h3><div class="progress-table-container"><table class="progress-table"><thead><tr><th>Topic</th><th>Date</th><th>Score</th><th>Accuracy</th><th>Change</th></tr></thead><tbody>';
        drills.slice(0, 5).forEach(d => {
            const dateStr = new Date(d.timestamp).toLocaleString();
            const sign = d.change > 0 ? '+' : '';
            html += `<tr>
                <td>${d.topic}</td>
                <td>${dateStr}</td>
                <td>${d.score}/${d.attempted}</td>
                <td>${d.accuracy}%</td>
                <td>${sign}${d.change} pp</td>
            </tr>`;
        });
        html += '</tbody></table></div>';
    }
    
    html += '<h3>Recent Diagnostics</h3><div class="progress-table-container"><table class="progress-table"><thead><tr><th>Date</th><th>Score</th><th>Accuracy</th></tr></thead><tbody>';
    diags.slice(0, 5).forEach(d => {
        const dateStr = new Date(d.timestamp).toLocaleString();
        html += `<tr>
            <td>${dateStr}</td>
            <td>${d.score}/${d.attempted}</td>
            <td>${d.accuracy}%</td>
        </tr>`;
    });
    html += '</tbody></table></div>';
    
    content.innerHTML = html;
    switchScreen('progress');
}

function resetProgress() {
    if(confirm("Reset all progress history? This cannot be undone.")) {
        const history = getSavedHistory() || {};
        history.diagnostics = [];
        history.drills = [];
        history.topicPractices = [];
        saveHistory(history);
        checkHistory(); // Updates home screen history section
        showProgressScreen();
    }
}
