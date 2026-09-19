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
    drillResults: document.getElementById('drill-results-screen')
};

// Start Screen elements
const startDiagnosticBtn = document.getElementById('start-diagnostic-btn');
const historySection = document.getElementById('history-section');
const viewHistoryBtn = document.getElementById('view-history-btn');
const clearHistoryBtn = document.getElementById('clear-history-btn');

// Quiz Screen elements
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
        if (mode === 'drill' && userAnswers[q.qid]) {
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
    if (mode === 'drill' && userAnswers[q.qid]) {
        showDrillFeedback(q);
    } else {
        drillFeedback.classList.add('hidden');
    }
}

function selectOption(optNum) {
    if (mode === 'drill') {
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
        feedbackText.textContent = "Correct!";
        feedbackText.style.color = "#166534";
    } else {
        drillFeedback.classList.add('wrong');
        feedbackText.textContent = `Incorrect. The correct answer was option ${q.correctOption}.`;
        feedbackText.style.color = "#991b1b";
    }
    
    feedbackExplanation.textContent = q.explanation || "No explanation available.";
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
    } else {
        calculateDrillResults();
        switchScreen('drillResults');
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
}

// Run init
window.addEventListener('DOMContentLoaded', initApp);
