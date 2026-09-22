const STORAGE_KEY = 'govcrackexam-drill-v1';

// State variables
let questionsBank = [];
let frequencyData = {};
let metadata = {};

let currentQuiz = [];
let currentQuestionIndex = 0;
let userAnswers = {};
let markedQuestions = new Set(); // key: question ID, value: selected option (1-4)
let mode = 'diagnostic'; // 'diagnostic' or 'drill'
let drillTopics = []; // Topics selected for drill

// DOM Elements
const screens = {
    start: document.getElementById('start-screen'),
    quiz: document.getElementById('quiz-screen'),
    results: document.getElementById('results-screen'),
    drillResults: document.getElementById('drill-results-screen'),
    progress: document.getElementById('progress-screen'),
    topicPracticeResults: document.getElementById('topic-practice-results-screen'),
    fullPracticeResults: document.getElementById('full-practice-results-screen')
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
const markReviewBtn = document.getElementById('mark-review-btn');
const paletteContainer = document.getElementById('quiz-palette-container');
const palette = document.getElementById('quiz-palette');
const confirmModal = document.getElementById('submit-confirm-modal');
const confirmContinueBtn = document.getElementById('confirm-continue-btn');
const confirmSubmitBtn = document.getElementById('confirm-submit-btn');

// Feedback Elements
const reportIssueBtn = document.getElementById('report-issue-btn');
const reportModal = document.getElementById('report-issue-modal');
const reportQidDisplay = document.getElementById('report-qid-display');
const issueType = document.getElementById('issue-type');
const issueDetails = document.getElementById('issue-details');
const reportCancelBtn = document.getElementById('report-cancel-btn');
const reportSubmitBtn = document.getElementById('report-submit-btn');
const feedbackCount = document.getElementById('feedback-count');
const noFeedbackMsg = document.getElementById('no-feedback-msg');
const exportFeedbackBtn = document.getElementById('export-feedback-btn');
const clearFeedbackBtn = document.getElementById('clear-feedback-btn');

// Feedback Review Elements
const frTotalReports = document.getElementById('fr-total-reports');
const frQuestionsReported = document.getElementById('fr-questions-reported');
const frMostReported = document.getElementById('fr-most-reported');
const frMostCommon = document.getElementById('fr-most-common');
const frNoFeedbackMsg = document.getElementById('fr-no-feedback-msg');
const feedbackReviewList = document.getElementById('feedback-review-list');
const exportReviewBtn = document.getElementById('export-review-btn');
const clearReviewBtn = document.getElementById('clear-review-btn');

const reviewModal = document.getElementById('review-question-modal');
const revCloseIcon = document.getElementById('review-close-icon');
const revCancelBtn = document.getElementById('rev-cancel-btn');
const revMarkReviewedBtn = document.getElementById('rev-mark-reviewed-btn');
const revDismissBtn = document.getElementById('rev-dismiss-btn');
const revQid = document.getElementById('rev-qid');
const revTopic = document.getElementById('rev-topic');
const revQuestionText = document.getElementById('rev-question-text');
const revOptions = document.getElementById('rev-options');
const revCorrect = document.getElementById('rev-correct');
const revExplanation = document.getElementById('rev-explanation');
const revFeedbackList = document.getElementById('rev-feedback-list');

let currentReviewQid = null;


const drillFeedback = document.getElementById('drill-feedback');
const feedbackText = document.getElementById('feedback-text');
const feedbackExplanation = document.getElementById('feedback-explanation');

// Initialize App

function startTopicPractice(topic) {
    const diffSelect = document.getElementById('difficulty-select');
    const difficultyFilter = diffSelect ? diffSelect.value : 'All';
    markedQuestions = new Set();
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
    const difficultyPerformance = { Easy: {attempted:0, correct:0}, Medium: {attempted:0, correct:0}, Hard: {attempted:0, correct:0} };
    const topicDiff = {};
    currentQuiz.forEach(q => {
        if (!topicDiff[q.subtopic]) topicDiff[q.subtopic] = { Easy: {attempted:0, correct:0}, Medium: {attempted:0, correct:0}, Hard: {attempted:0, correct:0} };
        let diff = q.difficulty || 'Medium';
        difficultyPerformance[diff].attempted++;
        topicDiff[q.subtopic][diff].attempted++;
        if (userAnswers[q.qid] === q.correctOption) {
            totalCorrect++;
            difficultyPerformance[diff].correct++;
            topicDiff[q.subtopic][diff].correct++;
        }
    });
    for(let diff in difficultyPerformance) {
        let d = difficultyPerformance[diff];
        d.accuracy = d.attempted > 0 ? Math.round((d.correct/d.attempted)*100) : 0;
    }

    const accuracy = attempted > 0 ? Math.round((totalCorrect / attempted) * 100) : 0;
    const topic = drillTopics[0];
    
    document.getElementById('topic-practice-name').textContent = topic;
    document.getElementById('topic-practice-score').textContent = `${totalCorrect} / ${attempted} Correct`;
    document.getElementById('topic-practice-accuracy').textContent = `${accuracy}% Accuracy`;
    renderMistakes('topic-practice-mistakes-container');
    
    // Save history
    const history = getSavedHistory() || {};
    if (!history.topicPractices) history.topicPractices = [];
        history.fullPractices = [];
    
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
    updateQuestionHistory(currentQuiz, userAnswers, 'topicPractice');
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
        document.getElementById('start-full-practice-btn').addEventListener('click', startFullPractice);
        const retakeFullBtn = document.getElementById('retake-full-practice-btn');
        if (retakeFullBtn) retakeFullBtn.addEventListener('click', startFullPractice);
        const homeFullBtn = document.getElementById('home-btn-full-practice');
        if (homeFullBtn) homeFullBtn.addEventListener('click', showStartScreen);

        startDiagnosticBtn.addEventListener('click', startDiagnostic);
        viewHistoryBtn.addEventListener('click', showResultsScreen);
        clearHistoryBtn.addEventListener('click', clearHistory);
        prevBtn.addEventListener('click', goPrevious);
        nextBtn.addEventListener('click', goNext);
                submitBtn.addEventListener('click', submitQuiz);
        
        if(markReviewBtn) markReviewBtn.addEventListener('click', toggleMarkReview);
        if(confirmContinueBtn) confirmContinueBtn.addEventListener('click', () => confirmModal.classList.add('hidden'));
        if(confirmSubmitBtn) confirmSubmitBtn.addEventListener('click', () => {
            confirmModal.classList.add('hidden');
            calculateFullPracticeResults();
            switchScreen('fullPracticeResults');
        });
        
        // Feedback Listeners
        if (reportIssueBtn) reportIssueBtn.addEventListener('click', openReportModal);
        if (reportCancelBtn) reportCancelBtn.addEventListener('click', () => reportModal.classList.add('hidden'));
        if (reportSubmitBtn) reportSubmitBtn.addEventListener('click', submitReport);
        if (exportFeedbackBtn) exportFeedbackBtn.addEventListener('click', exportFeedback);
        if (clearFeedbackBtn) clearFeedbackBtn.addEventListener('click', clearStoredFeedback);
        
        // Question Review Listeners
        ['qr-status-filter', 'qr-topic-filter', 'qr-diff-filter'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('change', renderQuestionReview);
        });
        const qrModal = document.getElementById('qr-modal');
        if (document.getElementById('qr-close-icon')) document.getElementById('qr-close-icon').addEventListener('click', () => qrModal.classList.add('hidden'));
        if (document.getElementById('qr-close-btn')) document.getElementById('qr-close-btn').addEventListener('click', () => qrModal.classList.add('hidden'));

        // Feedback Review Listeners
        if (exportReviewBtn) exportReviewBtn.addEventListener('click', exportReviewData);
        if (clearReviewBtn) clearReviewBtn.addEventListener('click', clearReviewStatus);
        
        if (revCloseIcon) revCloseIcon.addEventListener('click', () => reviewModal.classList.add('hidden'));
        if (revCancelBtn) revCancelBtn.addEventListener('click', () => reviewModal.classList.add('hidden'));
        if (revMarkReviewedBtn) revMarkReviewedBtn.addEventListener('click', () => updateReviewStatus('reviewed'));
        if (revDismissBtn) revDismissBtn.addEventListener('click', () => updateReviewStatus('dismissed'));

        // Close modal on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (reportModal && !reportModal.classList.contains('hidden')) {
                    reportModal.classList.add('hidden');
                }
                if (reviewModal && !reviewModal.classList.contains('hidden')) {
                    reviewModal.classList.add('hidden');
                }
                const qrModal = document.getElementById('qr-modal');
                if (qrModal && !qrModal.classList.contains('hidden')) {
                    qrModal.classList.add('hidden');
                }
            }
        });


        
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
    markedQuestions = new Set();
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
    
    
    // Mode specific UI
    if (mode === 'fullPractice') {
        if(paletteContainer) paletteContainer.classList.remove('hidden');
        if(markReviewBtn) markReviewBtn.classList.remove('hidden');
        renderPalette();
        
        if (markedQuestions.has(q.qid)) {
            if(markReviewBtn) markReviewBtn.textContent = 'Unmark Review';
            if(markReviewBtn) markReviewBtn.classList.add('marked');
        } else {
            if(markReviewBtn) markReviewBtn.textContent = 'Mark for Review';
            if(markReviewBtn) markReviewBtn.classList.remove('marked');
        }
    } else {
        if(paletteContainer) paletteContainer.classList.add('hidden');
        if(markReviewBtn) markReviewBtn.classList.add('hidden');
    }

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
        if (mode === 'fullPractice') renderPalette();
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


function toggleMarkReview() {
    const q = currentQuiz[currentQuestionIndex];
    if (markedQuestions.has(q.qid)) {
        markedQuestions.delete(q.qid);
    } else {
        markedQuestions.add(q.qid);
    }
    renderQuestion();
}

function renderPalette() {
    if (!palette) return;
    palette.innerHTML = '';
    currentQuiz.forEach((q, idx) => {
        const btn = document.createElement('button');
        btn.className = 'palette-btn';
        btn.textContent = idx + 1;
        
        if (idx === currentQuestionIndex) {
            btn.classList.add('current');
        }
        
        if (userAnswers[q.qid]) {
            btn.classList.add('answered');
        }
        
        if (markedQuestions.has(q.qid)) {
            btn.classList.add('marked');
        }
        
        btn.addEventListener('click', () => {
            currentQuestionIndex = idx;
            renderQuestion();
        });
        
        palette.appendChild(btn);
    });
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
    if (mode === 'fullPractice') {
        const answered = Object.keys(userAnswers).length;
        const unanswered = currentQuiz.length - answered;
        const marked = markedQuestions.size;
        
        if (document.getElementById('confirm-answered')) document.getElementById('confirm-answered').textContent = answered;
        if (document.getElementById('confirm-total')) document.getElementById('confirm-total').textContent = currentQuiz.length;
        if (document.getElementById('confirm-unanswered')) document.getElementById('confirm-unanswered').textContent = unanswered;
        if (document.getElementById('confirm-marked')) document.getElementById('confirm-marked').textContent = marked;
        
        if (confirmModal) confirmModal.classList.remove('hidden');
        return;
    }

    if (Object.keys(userAnswers).length < currentQuiz.length) {
        if (typeof confirm === 'function' && !confirm('You have unanswered questions. Are you sure you want to submit?')) {
            return;
        }
    }

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

    const difficultyPerformance = { Easy: {attempted:0, correct:0}, Medium: {attempted:0, correct:0}, Hard: {attempted:0, correct:0} };
    const topicDiff = {};
    currentQuiz.forEach(q => {
        if (!topicStats[q.subtopic]) topicStats[q.subtopic] = { total: 0, correct: 0 };
        if (!topicDiff[q.subtopic]) topicDiff[q.subtopic] = { Easy: {attempted:0, correct:0}, Medium: {attempted:0, correct:0}, Hard: {attempted:0, correct:0} };
        topicStats[q.subtopic].total++;
        
        let diff = q.difficulty || 'Medium';
        difficultyPerformance[diff].attempted++;
        topicDiff[q.subtopic][diff].attempted++;
        
        if (userAnswers[q.qid] === q.correctOption) {
            topicStats[q.subtopic].correct++;
            totalCorrect++;
            difficultyPerformance[diff].correct++;
            topicDiff[q.subtopic][diff].correct++;
        }
    });
    for(let diff in difficultyPerformance) {
        let d = difficultyPerformance[diff];
        d.accuracy = d.attempted > 0 ? Math.round((d.correct/d.attempted)*100) : 0;
    }

    const overallAccuracy = Math.round((totalCorrect / currentQuiz.length) * 100) || 0;
    
    const results = {
        totalQuestions: currentQuiz.length,
        totalCorrect,
        overallAccuracy,
        topics: {},
        difficultyPerformance: difficultyPerformance,
        topicDiff: topicDiff
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
    
    updateQuestionHistory(currentQuiz, userAnswers, 'diagnostic');
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


    const diffContainer = document.getElementById('difficulty-results');
    if (diffContainer && results.difficultyPerformance) {
        let dh = '<h3 style="margin-bottom: 10px;">Difficulty Performance</h3><div style="display:flex; gap:10px; margin-bottom: 20px;">';
        ['Easy', 'Medium', 'Hard'].forEach(lvl => {
            if (results.difficultyPerformance[lvl] && results.difficultyPerformance[lvl].attempted > 0) {
                const d = results.difficultyPerformance[lvl];
                let color = lvl==='Easy'?'#10b981' : (lvl==='Hard'?'#ef4444' : '#f59e0b');
                dh += `<div class="card" style="flex:1; text-align:center; border: 1px solid ${color};">
                    <div style="font-weight:bold; margin-bottom:5px; color:${color};">${lvl}</div>
                    <div>${d.correct} / ${d.attempted}</div>
                    <div>${d.accuracy}%</div>
                </div>`;
            }
        });
        dh += '</div>';
        diffContainer.innerHTML = dh;
    }
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
    markedQuestions = new Set();
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
    const history = getSavedHistory() || {};
    const qh = history.questionHistory || {};
    const toggle = document.getElementById('adaptive-drill-toggle');
    const isAdaptive = toggle ? toggle.checked : true;
    
    let pool = questionsBank.filter(q => topics.includes(q.subtopic));
    
    if (isAdaptive) {
        pool.forEach(q => {
            const h = qh[q.qid];
            let score = 0;
            
            if (!h || h.attempts === 0) {
                // A. Unseen bonus (very high to ensure fresh coverage)
                score = 120;
            } else {
                // B. Low personal accuracy (0 to 100)
                const historyWeakness = 100 - h.accuracy;
                
                // C. Frequently incorrect (capped at 50)
                const repeatMissBonus = Math.min(h.incorrect * 10, 50);
                
                // D. Recent incorrect
                const recentMissBonus = (h.lastResult === 'incorrect') ? 30 : 0;
                
                // E. Difficulty adjustment (gently prioritize Easy base, defer Hard if equally missed)
                let diffAdj = 0;
                if (q.difficulty === 'Easy') diffAdj = 10;
                if (q.difficulty === 'Hard') diffAdj = -10;
                
                // F. Mastered / Recent correct penalty
                let masteredPenalty = 0;
                let recentCorrectPenalty = 0;
                if (h.attempts >= 3 && h.accuracy >= 80 && h.currentStreak >= 2) {
                    masteredPenalty = -100;
                } else if (h.lastResult === 'correct') {
                    recentCorrectPenalty = -40;
                }
                
                score = historyWeakness + repeatMissBonus + recentMissBonus + diffAdj + masteredPenalty + recentCorrectPenalty;
            }
            
            // Add tiny random noise (0 to 5) to break exact ties unpredictably
            q._adaptiveScore = score + (Math.random() * 5);
        });
        
        // Sort descending
        pool = pool.sort((a, b) => b._adaptiveScore - a._adaptiveScore);
    } else {
        // Legacy purely random fallback
        pool = pool.sort(() => 0.5 - Math.random());
    }
    
    // Store metadata for results screen
    window.currentDrillIsAdaptive = isAdaptive;
    
    return pool.slice(0, count);
}

function calculateDrillResults() {
    let totalCorrect = 0;
    const attempted = currentQuiz.length;
    const difficultyPerformance = { Easy: {attempted:0, correct:0}, Medium: {attempted:0, correct:0}, Hard: {attempted:0, correct:0} };
    const topicDiff = {};
    currentQuiz.forEach(q => {
        if (!topicDiff[q.subtopic]) topicDiff[q.subtopic] = { Easy: {attempted:0, correct:0}, Medium: {attempted:0, correct:0}, Hard: {attempted:0, correct:0} };
        let diff = q.difficulty || 'Medium';
        difficultyPerformance[diff].attempted++;
        topicDiff[q.subtopic][diff].attempted++;
        if (userAnswers[q.qid] === q.correctOption) {
            totalCorrect++;
            difficultyPerformance[diff].correct++;
            topicDiff[q.subtopic][diff].correct++;
        }
    });
    for(let diff in difficultyPerformance) {
        let d = difficultyPerformance[diff];
        d.accuracy = d.attempted > 0 ? Math.round((d.correct/d.attempted)*100) : 0;
    }

    const drillAccuracy = attempted > 0 ? Math.round((totalCorrect / attempted) * 100) : 0;
    
    document.getElementById('drill-topic-name').textContent = drillTopics.join(', ');
    document.getElementById('drill-score').textContent = `${totalCorrect} / ${attempted} Correct`;
    document.getElementById('drill-accuracy').textContent = `${drillAccuracy}% Accuracy`;
    renderMistakes('drill-mistakes-container');
    
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
    
    if (window.currentDrillIsAdaptive) {
        comparisonContainer.innerHTML += `
        <div style="margin-top: 15px; padding: 10px; background: rgba(59, 130, 246, 0.1); border-left: 3px solid var(--primary-color); border-radius: 4px; font-size: 0.85rem; text-align: left;">
            <strong>Adaptive Drill</strong><br>
            Topic prioritized: ${primaryTopic}<br>
            Questions selected based on your recorded practice history and difficulty. All calculations are local to this browser.
        </div>`;
    }

    // Save drill history
    if (!history.drills) history.drills = [];
    history.drills.unshift({
        timestamp: new Date().toISOString(),
        topic: primaryTopic,
        score: totalCorrect,
        attempted: attempted,
        accuracy: drillAccuracy,
        diagnosticAccuracy: diagnosticAccuracy,
        change: change,
        difficultyPerformance: difficultyPerformance,
        topicDiff: topicDiff,
        adaptive: window.currentDrillIsAdaptive || false
    });
    
    if (history.drills.length > 50) {
        history.drills = history.drills.slice(0, 50);
    }
    
    updateQuestionHistory(currentQuiz, userAnswers, 'drill');
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
    const fullPractices = history.fullPractices || [];
    
    const content = document.getElementById('progress-content');
    

    let aggDiff = { Easy: {att:0, cor:0}, Medium: {att:0, cor:0}, Hard: {att:0, cor:0} };
    function addDiff(histArray) {
        histArray.forEach(record => {
            if (record.difficultyPerformance) {
                for (let lvl of ['Easy', 'Medium', 'Hard']) {
                    if (record.difficultyPerformance[lvl]) {
                        aggDiff[lvl].att += record.difficultyPerformance[lvl].attempted;
                        aggDiff[lvl].cor += record.difficultyPerformance[lvl].correct;
                    }
                }
            }
        });
    }
    addDiff(diags); addDiff(drills); addDiff(topicPractices); addDiff(fullPractices);
    
    let diffHtml = '';
    if (aggDiff.Easy.att > 0 || aggDiff.Medium.att > 0 || aggDiff.Hard.att > 0) {
        diffHtml = '<div class="card" style="margin-bottom: 20px;"><h3 style="margin-bottom:10px;">Difficulty Performance</h3><div style="display:flex; gap:10px; flex-wrap:wrap;">';
        for (let lvl of ['Easy', 'Medium', 'Hard']) {
            if (aggDiff[lvl].att > 0) {
                let acc = Math.round((aggDiff[lvl].cor / aggDiff[lvl].att) * 100);
                let color = lvl==='Easy'?'#10b981' : (lvl==='Hard'?'#ef4444' : '#f59e0b');
                diffHtml += `<div style="flex:1; min-width: 100px; text-align:center; padding: 15px; border: 1px solid ${color}; border-radius: 6px; background: rgba(255,255,255,0.02);">
                    <div style="font-weight:bold; color: ${color}; margin-bottom:5px;">${lvl}</div>
                    <div style="font-size:1.2rem; margin-bottom:5px;">${acc}%</div>
                    <div style="font-size:0.8rem; color: var(--text-muted);">${aggDiff[lvl].cor} / ${aggDiff[lvl].att}</div>
                </div>`;
            } else {
                diffHtml += `<div style="flex:1; min-width: 100px; text-align:center; padding: 15px; border: 1px solid var(--border-color); border-radius: 6px; background: rgba(255,255,255,0.02); opacity: 0.5;">
                    <div style="font-weight:bold; color: var(--text-muted); margin-bottom:5px;">${lvl}</div>
                    <div style="font-size:0.9rem;">No data</div>
                </div>`;
            }
        }
        diffHtml += '</div></div>';
    }

    if (diags.length === 0 && drills.length === 0 && topicPractices.length === 0 && fullPractices.length === 0) {
        content.innerHTML = '<div class="empty-state" style="text-align: center; padding: 40px 20px;">' +
            '<h3 style="margin-bottom: 15px;">No progress yet</h3>' +
            '<p style="color: var(--text-muted);">Complete your first diagnostic to start tracking your progress.</p>' +
            '</div>';

    // Prepend difficulty html
    content.innerHTML = diffHtml + content.innerHTML;
    // Handle Feedback UI
    const feedbacks = getSavedFeedback();
    if (typeof feedbackCount !== 'undefined' && feedbackCount) feedbackCount.textContent = feedbacks.length;
    if (typeof noFeedbackMsg !== 'undefined' && noFeedbackMsg) {
        if (feedbacks.length === 0) {
            noFeedbackMsg.style.display = 'block';
        } else {
            noFeedbackMsg.style.display = 'none';
        }
    }
    if (typeof renderFeedbackReviewSection === 'function') {
        renderFeedbackReviewSection(feedbacks);
    }
    
    if (typeof renderQuestionReview === 'function') renderQuestionReview();
    
    let adaptiveCount = 0;
    let adaptiveQuestions = 0;
    drills.forEach(d => {
        if (d.adaptive) {
            adaptiveCount++;
            adaptiveQuestions += d.attempted || 10;
        }
    });
    
    if (adaptiveCount > 0) {
        let adapHtml = `
        <div class="card" style="margin-bottom: 20px;">
            <h3 style="margin-bottom:10px;">Adaptive Drill Summary</h3>
            <div style="display:flex; gap:10px; flex-wrap:wrap;">
                <div style="flex:1; min-width: 100px; text-align:center; padding: 15px; border: 1px solid var(--border-color); border-radius: 6px; background: rgba(255,255,255,0.02);">
                    <div style="font-weight:bold; color: var(--primary-color); margin-bottom:5px;">${adaptiveCount}</div>
                    <div style="font-size:0.9rem;">Drills Completed</div>
                </div>
                <div style="flex:1; min-width: 100px; text-align:center; padding: 15px; border: 1px solid var(--border-color); border-radius: 6px; background: rgba(255,255,255,0.02);">
                    <div style="font-weight:bold; color: var(--primary-color); margin-bottom:5px;">${adaptiveQuestions}</div>
                    <div style="font-size:0.9rem;">Adaptive Questions</div>
                </div>
            </div>
        </div>`;
        const content = document.getElementById('progress-content');
        if (content) {
            content.innerHTML = adapHtml + content.innerHTML;
        }
    }
    switchScreen('progress');
        return;
    }
    
    let bestDiag = 0;
    diags.forEach(d => { if(d.accuracy > bestDiag) bestDiag = d.accuracy; });
    
    let bestDrill = 0;
    drills.forEach(d => { if(d.accuracy > bestDrill) bestDrill = d.accuracy; });
    let bestFull = 0;
    fullPractices.forEach(d => { if(d.accuracy > bestFull) bestFull = d.accuracy; });
    
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
                <p style="font-size: 0.9rem; margin-top: 5px;">Latest: ${diags.length > 0 ? diags[0].accuracy + '%' : 'N/A'}</p>
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
        'Letter-cluster Analogy / Series', 'Mathematical Operations', 'Syllogism', 'Number/Figure Series', 'Classification (Odd One Out)', 'Analogy (Word/Number)'
    ];
    
    html += '<div class="progress-table-container"><table class="progress-table"><thead><tr><th>Topic</th><th>Latest</th><th>Best</th><th>Status</th><th>Drills</th><th>Topic Practice</th></tr></thead><tbody>';
    
    topics.forEach(t => {
        const records = [];
        
        diags.forEach(d => {
            const td = d.topicPerformance[t];
            if (td && td.attempted > 0) {
                records.push({ timestamp: new Date(d.timestamp).getTime(), accuracy: td.accuracy });
            }
        });
        
        const topicDrills = drills.filter(d => d.topic === t);
        topicDrills.forEach(d => {
            records.push({ timestamp: new Date(d.timestamp).getTime(), accuracy: d.accuracy });
        });
        
        const topicPracs = topicPractices.filter(d => d.topic === t);
        topicPracs.forEach(d => {
            records.push({ timestamp: new Date(d.timestamp).getTime(), accuracy: d.accuracy });
        });
        fullPractices.forEach(d => {
            const td = d.topicPerformance && d.topicPerformance[t];
            if (td && td.attempted > 0) {
                records.push({ timestamp: new Date(d.timestamp).getTime(), accuracy: td.accuracy });
            }
        });
        
        let drillsCompleted = topicDrills.length;
        let practicesCompleted = topicPracs.length;
        
        let latestDisplay = 'N/A';
        let bestDisplay = 'N/A';
        let statusHTML = '<span class="change-neutral">-</span>';
        
        if (records.length > 0) {
            records.sort((a, b) => a.timestamp - b.timestamp);
            
            const allAccs = records.map(r => r.accuracy);
            
            const latestVal = allAccs[allAccs.length - 1];
            const bestVal = Math.max(...allAccs);
            
            latestDisplay = latestVal + '%';
            bestDisplay = bestVal + '%';
            
            if (allAccs.length >= 2) {
                const prev = allAccs[allAccs.length - 2];
                if (latestVal > prev) {
                    statusHTML = '<span class="change-positive">Improved</span>';
                } else if (latestVal < prev) {
                    statusHTML = '<span class="change-negative">Needs More Practice</span>';
                } else {
                    statusHTML = '<span class="change-neutral">No Change</span>';
                }
            }
        }
        
        html += `<tr>
            <td>${t}</td>
            <td>${latestDisplay}</td>
            <td>${bestDisplay}</td>
            <td>${statusHTML}</td>
            <td>${drillsCompleted}</td>
            <td>${practicesCompleted}</td>
        </tr>`;
    });
    
    html += '</tbody></table></div>';
    
    // Topic x Difficulty Summary
    const txD = {};
    topics.forEach(t => { txD[t] = { Easy: {c:0, a:0}, Medium: {c:0, a:0}, Hard: {c:0, a:0} }; });
    
    function addTxD(records) {
        records.forEach(r => {
            if (r.topicDiff) {
                for (let t in r.topicDiff) {
                    if (txD[t]) {
                        ['Easy', 'Medium', 'Hard'].forEach(lvl => {
                            if (r.topicDiff[t][lvl]) {
                                txD[t][lvl].a += r.topicDiff[t][lvl].attempted;
                                txD[t][lvl].c += r.topicDiff[t][lvl].correct;
                            }
                        });
                    }
                }
            }
        });
    }
    addTxD(diags); addTxD(drills); addTxD(topicPractices); addTxD(fullPractices);
    
    let hasTxD = false;
    for (let t in txD) {
        if (txD[t].Easy.a > 0 || txD[t].Medium.a > 0 || txD[t].Hard.a > 0) hasTxD = true;
    }
    
    if (hasTxD) {
        html += '<h3 style="margin-top: 30px;">Topic by Difficulty Performance</h3>';
        html += '<div class="progress-table-container"><table class="progress-table" style="font-size: 0.9rem;"><thead><tr><th>Topic</th><th>Easy</th><th>Medium</th><th>Hard</th></tr></thead><tbody>';
        
        topics.forEach(t => {
            let ez = txD[t].Easy.a > 0 ? `${Math.round(txD[t].Easy.c/txD[t].Easy.a*100)}%` : '-';
            let md = txD[t].Medium.a > 0 ? `${Math.round(txD[t].Medium.c/txD[t].Medium.a*100)}%` : '-';
            let hd = txD[t].Hard.a > 0 ? `${Math.round(txD[t].Hard.c/txD[t].Hard.a*100)}%` : '-';
            
            if (ez !== '-' || md !== '-' || hd !== '-') {
                html += `<tr><td>${t}</td><td>${ez}</td><td>${md}</td><td>${hd}</td></tr>`;
            }
        });
        html += '</tbody></table></div>';
    }
    
    
    
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
    
    // Topic x Difficulty Summary
    const txD = {};
    topics.forEach(t => { txD[t] = { Easy: {c:0, a:0}, Medium: {c:0, a:0}, Hard: {c:0, a:0} }; });
    
    function addTxD(records) {
        records.forEach(r => {
            if (r.topicDiff) {
                for (let t in r.topicDiff) {
                    if (txD[t]) {
                        ['Easy', 'Medium', 'Hard'].forEach(lvl => {
                            if (r.topicDiff[t][lvl]) {
                                txD[t][lvl].a += r.topicDiff[t][lvl].attempted;
                                txD[t][lvl].c += r.topicDiff[t][lvl].correct;
                            }
                        });
                    }
                }
            }
        });
    }
    addTxD(diags); addTxD(drills); addTxD(topicPractices); addTxD(fullPractices);
    
    let hasTxD = false;
    for (let t in txD) {
        if (txD[t].Easy.a > 0 || txD[t].Medium.a > 0 || txD[t].Hard.a > 0) hasTxD = true;
    }
    
    if (hasTxD) {
        html += '<h3 style="margin-top: 30px;">Topic by Difficulty Performance</h3>';
        html += '<div class="progress-table-container"><table class="progress-table" style="font-size: 0.9rem;"><thead><tr><th>Topic</th><th>Easy</th><th>Medium</th><th>Hard</th></tr></thead><tbody>';
        
        topics.forEach(t => {
            let ez = txD[t].Easy.a > 0 ? `${Math.round(txD[t].Easy.c/txD[t].Easy.a*100)}%` : '-';
            let md = txD[t].Medium.a > 0 ? `${Math.round(txD[t].Medium.c/txD[t].Medium.a*100)}%` : '-';
            let hd = txD[t].Hard.a > 0 ? `${Math.round(txD[t].Hard.c/txD[t].Hard.a*100)}%` : '-';
            
            if (ez !== '-' || md !== '-' || hd !== '-') {
                html += `<tr><td>${t}</td><td>${ez}</td><td>${md}</td><td>${hd}</td></tr>`;
            }
        });
        html += '</tbody></table></div>';
    }
    
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
    
    // Topic x Difficulty Summary
    const txD = {};
    topics.forEach(t => { txD[t] = { Easy: {c:0, a:0}, Medium: {c:0, a:0}, Hard: {c:0, a:0} }; });
    
    function addTxD(records) {
        records.forEach(r => {
            if (r.topicDiff) {
                for (let t in r.topicDiff) {
                    if (txD[t]) {
                        ['Easy', 'Medium', 'Hard'].forEach(lvl => {
                            if (r.topicDiff[t][lvl]) {
                                txD[t][lvl].a += r.topicDiff[t][lvl].attempted;
                                txD[t][lvl].c += r.topicDiff[t][lvl].correct;
                            }
                        });
                    }
                }
            }
        });
    }
    addTxD(diags); addTxD(drills); addTxD(topicPractices); addTxD(fullPractices);
    
    let hasTxD = false;
    for (let t in txD) {
        if (txD[t].Easy.a > 0 || txD[t].Medium.a > 0 || txD[t].Hard.a > 0) hasTxD = true;
    }
    
    if (hasTxD) {
        html += '<h3 style="margin-top: 30px;">Topic by Difficulty Performance</h3>';
        html += '<div class="progress-table-container"><table class="progress-table" style="font-size: 0.9rem;"><thead><tr><th>Topic</th><th>Easy</th><th>Medium</th><th>Hard</th></tr></thead><tbody>';
        
        topics.forEach(t => {
            let ez = txD[t].Easy.a > 0 ? `${Math.round(txD[t].Easy.c/txD[t].Easy.a*100)}%` : '-';
            let md = txD[t].Medium.a > 0 ? `${Math.round(txD[t].Medium.c/txD[t].Medium.a*100)}%` : '-';
            let hd = txD[t].Hard.a > 0 ? `${Math.round(txD[t].Hard.c/txD[t].Hard.a*100)}%` : '-';
            
            if (ez !== '-' || md !== '-' || hd !== '-') {
                html += `<tr><td>${t}</td><td>${ez}</td><td>${md}</td><td>${hd}</td></tr>`;
            }
        });
        html += '</tbody></table></div>';
    }
    
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
    
    // Topic x Difficulty Summary
    const txD = {};
    topics.forEach(t => { txD[t] = { Easy: {c:0, a:0}, Medium: {c:0, a:0}, Hard: {c:0, a:0} }; });
    
    function addTxD(records) {
        records.forEach(r => {
            if (r.topicDiff) {
                for (let t in r.topicDiff) {
                    if (txD[t]) {
                        ['Easy', 'Medium', 'Hard'].forEach(lvl => {
                            if (r.topicDiff[t][lvl]) {
                                txD[t][lvl].a += r.topicDiff[t][lvl].attempted;
                                txD[t][lvl].c += r.topicDiff[t][lvl].correct;
                            }
                        });
                    }
                }
            }
        });
    }
    addTxD(diags); addTxD(drills); addTxD(topicPractices); addTxD(fullPractices);
    
    let hasTxD = false;
    for (let t in txD) {
        if (txD[t].Easy.a > 0 || txD[t].Medium.a > 0 || txD[t].Hard.a > 0) hasTxD = true;
    }
    
    if (hasTxD) {
        html += '<h3 style="margin-top: 30px;">Topic by Difficulty Performance</h3>';
        html += '<div class="progress-table-container"><table class="progress-table" style="font-size: 0.9rem;"><thead><tr><th>Topic</th><th>Easy</th><th>Medium</th><th>Hard</th></tr></thead><tbody>';
        
        topics.forEach(t => {
            let ez = txD[t].Easy.a > 0 ? `${Math.round(txD[t].Easy.c/txD[t].Easy.a*100)}%` : '-';
            let md = txD[t].Medium.a > 0 ? `${Math.round(txD[t].Medium.c/txD[t].Medium.a*100)}%` : '-';
            let hd = txD[t].Hard.a > 0 ? `${Math.round(txD[t].Hard.c/txD[t].Hard.a*100)}%` : '-';
            
            if (ez !== '-' || md !== '-' || hd !== '-') {
                html += `<tr><td>${t}</td><td>${ez}</td><td>${md}</td><td>${hd}</td></tr>`;
            }
        });
        html += '</tbody></table></div>';
    }
    
    
    content.innerHTML = html;

    // Prepend difficulty html
    content.innerHTML = diffHtml + content.innerHTML;
    // Handle Feedback UI
    const feedbacks = getSavedFeedback();
    if (typeof feedbackCount !== 'undefined' && feedbackCount) feedbackCount.textContent = feedbacks.length;
    if (typeof noFeedbackMsg !== 'undefined' && noFeedbackMsg) {
        if (feedbacks.length === 0) {
            noFeedbackMsg.style.display = 'block';
        } else {
            noFeedbackMsg.style.display = 'none';
        }
    }
    if (typeof renderFeedbackReviewSection === 'function') {
        renderFeedbackReviewSection(feedbacks);
    }
    
    if (typeof renderQuestionReview === 'function') renderQuestionReview();
    
    let adaptiveCount = 0;
    let adaptiveQuestions = 0;
    drills.forEach(d => {
        if (d.adaptive) {
            adaptiveCount++;
            adaptiveQuestions += d.attempted || 10;
        }
    });
    
    if (adaptiveCount > 0) {
        let adapHtml = `
        <div class="card" style="margin-bottom: 20px;">
            <h3 style="margin-bottom:10px;">Adaptive Drill Summary</h3>
            <div style="display:flex; gap:10px; flex-wrap:wrap;">
                <div style="flex:1; min-width: 100px; text-align:center; padding: 15px; border: 1px solid var(--border-color); border-radius: 6px; background: rgba(255,255,255,0.02);">
                    <div style="font-weight:bold; color: var(--primary-color); margin-bottom:5px;">${adaptiveCount}</div>
                    <div style="font-size:0.9rem;">Drills Completed</div>
                </div>
                <div style="flex:1; min-width: 100px; text-align:center; padding: 15px; border: 1px solid var(--border-color); border-radius: 6px; background: rgba(255,255,255,0.02);">
                    <div style="font-weight:bold; color: var(--primary-color); margin-bottom:5px;">${adaptiveQuestions}</div>
                    <div style="font-size:0.9rem;">Adaptive Questions</div>
                </div>
            </div>
        </div>`;
        const content = document.getElementById('progress-content');
        if (content) {
            content.innerHTML = adapHtml + content.innerHTML;
        }
    }
    switchScreen('progress');
}

function resetProgress() {
    if(confirm("Reset all progress history? This cannot be undone.")) {
        const history = getSavedHistory() || {};
        history.diagnostics = [];
        history.drills = [];
        history.topicPractices = [];
        history.fullPractices = [];
        history.questionHistory = {};
        saveHistory(history);
        checkHistory(); // Updates home screen history section
        showProgressScreen();
    }
}


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
        const safeExplanation = escapeHTML(q.explanation || 'No explanation available.').replace(/
/g, '<br>');
        const diff = q.difficulty || 'Medium';
        const badgeColor = diff === 'Easy' ? '#10b981' : (diff === 'Hard' ? '#ef4444' : '#f59e0b');
        
        html += `
        <div class="mistake-item card" style="margin-bottom: 15px; text-align: left; padding: 15px; background-color: var(--card-bg); border: 1px solid var(--border-color); border-radius: 6px;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 15px;">
                <p style="font-weight: 600; margin: 0;">Q${idx + 1}. ${safeQ}</p>
                <span style="font-size: 0.75rem; padding: 3px 6px; border-radius: 4px; background-color: ${badgeColor}; color: white; margin-left: 10px; flex-shrink: 0;">${diff}</span>
            </div>
            
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


function startFullPractice() {
    markedQuestions = new Set();
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

    const difficultyPerformance = { Easy: {attempted:0, correct:0}, Medium: {attempted:0, correct:0}, Hard: {attempted:0, correct:0} };
    const topicDiff = {};
    currentQuiz.forEach(q => {
        if (!topicStats[q.subtopic]) {
            topicStats[q.subtopic] = { attempted: 0, correct: 0 };
        }
        if (!topicDiff[q.subtopic]) topicDiff[q.subtopic] = { Easy: {attempted:0, correct:0}, Medium: {attempted:0, correct:0}, Hard: {attempted:0, correct:0} };
        topicStats[q.subtopic].attempted++;
        
        let diff = q.difficulty || 'Medium';
        difficultyPerformance[diff].attempted++;
        topicDiff[q.subtopic][diff].attempted++;
        
        if (userAnswers[q.qid] === q.correctOption) {
            totalCorrect++;
            topicStats[q.subtopic].correct++;
            difficultyPerformance[diff].correct++;
            topicDiff[q.subtopic][diff].correct++;
        }
    });
    for(let diff in difficultyPerformance) {
        let d = difficultyPerformance[diff];
        d.accuracy = d.attempted > 0 ? Math.round((d.correct/d.attempted)*100) : 0;
    }

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
        "Syllogism",
        "Number/Figure Series"
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
        topicPerformance: topicPerformance,
        difficultyPerformance: difficultyPerformance,
        topicDiff: topicDiff
    });
    
    if (history.fullPractices.length > 50) {
        history.fullPractices = history.fullPractices.slice(0, 50);
    }
    updateQuestionHistory(currentQuiz, userAnswers, 'fullPractice');
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
        const safeExplanation = escapeHTML(q.explanation || 'No explanation available.').replace(/\n/g, '<br>');
        
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


// ==========================================
// FEEDBACK LOGIC
// ==========================================

function getSavedFeedback() {
    const raw = localStorage.getItem('govcrackexam-feedback-v1');
    if (!raw) return [];
    try {
        return JSON.parse(raw);
    } catch (e) {
        return [];
    }
}

function openReportModal() {
    const q = currentQuiz[currentQuestionIndex];
    if (!q) return;
    const shortId = q.qid.substring(0, 8);
    reportQidDisplay.textContent = 'Q-' + shortId;
    issueType.value = 'Wrong answer';
    issueDetails.value = '';
    reportModal.classList.remove('hidden');
}

function submitReport() {
    const q = currentQuiz[currentQuestionIndex];
    if (!q) return;
    
    reportSubmitBtn.disabled = true;
    reportSubmitBtn.textContent = 'Saving...';
    
    setTimeout(() => {
        const feedbacks = getSavedFeedback();
        
        const newFeedback = {
            id: 'fb-' + Math.random().toString(36).substr(2, 9),
            timestamp: new Date().toISOString(),
            questionId: q.qid,
            mode: mode,
            issueType: issueType.value,
            details: issueDetails.value.trim()
        };
        
        feedbacks.unshift(newFeedback);
        
        // Limit to 100
        if (feedbacks.length > 100) {
            feedbacks.pop();
        }
        
        localStorage.setItem('govcrackexam-feedback-v1', JSON.stringify(feedbacks));
        
        alert("Thanks. Your feedback has been saved on this device.");
        
        reportSubmitBtn.disabled = false;
        reportSubmitBtn.textContent = 'Submit Report';
        reportModal.classList.add('hidden');
    }, 300); // slight delay to prevent double-clicks
}

function exportFeedback() {
    const feedbacks = getSavedFeedback();
    if (feedbacks.length === 0) {
        alert("No feedback to export.");
        return;
    }
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(feedbacks, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "govcrackexam-feedback.json");
    dlAnchorElem.click();
}

function clearStoredFeedback() {
    const feedbacks = getSavedFeedback();
    if (feedbacks.length === 0) return;
    
    if (confirm("Clear all saved question feedback from this browser?")) {
        localStorage.removeItem('govcrackexam-feedback-v1');
        showProgressScreen(); // Refresh the progress UI
    }
}


// ==========================================
// FEEDBACK REVIEW LOGIC
// ==========================================

function getReviewStatuses() {
    const raw = localStorage.getItem('govcrackexam-feedback-review-v1');
    if (!raw) return {};
    try {
        return JSON.parse(raw);
    } catch (e) {
        return {};
    }
}

function saveReviewStatuses(statuses) {
    localStorage.setItem('govcrackexam-feedback-review-v1', JSON.stringify(statuses));
}

function renderFeedbackReviewSection(feedbacks) {
    if (!feedbackReviewList) return;
    
    feedbackReviewList.innerHTML = '';
    
    if (feedbacks.length === 0) {
        if(frNoFeedbackMsg) frNoFeedbackMsg.style.display = 'block';
        if(document.getElementById('feedback-review-stats')) document.getElementById('feedback-review-stats').style.display = 'none';
        return;
    }
    
    if(frNoFeedbackMsg) frNoFeedbackMsg.style.display = 'none';
    if(document.getElementById('feedback-review-stats')) document.getElementById('feedback-review-stats').style.display = 'block';

    const groups = {};
    const issueCounts = {};
    
    feedbacks.forEach(fb => {
        if (!groups[fb.questionId]) {
            groups[fb.questionId] = {
                questionId: fb.questionId,
                reports: [],
                newest: fb.timestamp
            };
        }
        groups[fb.questionId].reports.push(fb);
        if (fb.timestamp > groups[fb.questionId].newest) {
            groups[fb.questionId].newest = fb.timestamp;
        }
        
        issueCounts[fb.issueType] = (issueCounts[fb.issueType] || 0) + 1;
    });
    
    const statuses = getReviewStatuses();
    
    const groupArray = Object.values(groups);
    
    // Sort: Needs Review first, then report count desc
    groupArray.sort((a, b) => {
        const statusA = (statuses[a.questionId] && statuses[a.questionId].status) || 'needs-review';
        const statusB = (statuses[b.questionId] && statuses[b.questionId].status) || 'needs-review';
        
        if (statusA === 'needs-review' && statusB !== 'needs-review') return -1;
        if (statusA !== 'needs-review' && statusB === 'needs-review') return 1;
        
        if (b.reports.length !== a.reports.length) {
            return b.reports.length - a.reports.length;
        }
        return b.newest > a.newest ? 1 : -1;
    });
    
    // Stats
    let mostReportedId = '-';
    let maxReports = 0;
    groupArray.forEach(g => {
        if (g.reports.length > maxReports) {
            maxReports = g.reports.length;
            mostReportedId = 'Q-' + g.questionId.substring(0,8);
        }
    });
    
    let mostCommon = '-';
    let maxIssueCount = 0;
    for (const [issue, count] of Object.entries(issueCounts)) {
        if (count > maxIssueCount) {
            maxIssueCount = count;
            mostCommon = issue;
        }
    }
    
    if(frTotalReports) frTotalReports.textContent = feedbacks.length;
    if(frQuestionsReported) frQuestionsReported.textContent = groupArray.length;
    if(frMostReported) frMostReported.textContent = mostReportedId;
    if(frMostCommon) frMostCommon.textContent = mostCommon;
    
    groupArray.forEach(g => {
        const qRecord = questionsBank.find(q => q.qid === g.questionId);
        const topic = qRecord ? qRecord.subtopic : 'Unknown';
        const statusObj = statuses[g.questionId] || { status: 'needs-review' };
        
        const card = document.createElement('div');
        card.style.cssText = 'background: var(--bg-card); padding: 15px; border-radius: 8px; border: 1px solid var(--border-color);';
        
        const statusLabel = statusObj.status === 'needs-review' ? 'Needs Review' : (statusObj.status === 'reviewed' ? 'Reviewed' : 'Dismissed');
        const statusColor = statusObj.status === 'needs-review' ? '#eab308' : (statusObj.status === 'reviewed' ? '#22c55e' : 'var(--text-muted)');
        
        const issuesList = [...new Set(g.reports.map(r => r.issueType))].join(', ');
        
        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; flex-wrap: wrap; gap: 10px;">
                <div>
                    <h4 style="margin-bottom: 5px;">Question: Q-${g.questionId.substring(0,8)}</h4>
                    <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 5px;">${topic}</p>
                </div>
                <div style="text-align: right;">
                    <span style="display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: bold; background: ${statusColor}20; color: ${statusColor};">${statusLabel}</span>
                </div>
            </div>
            <p style="font-size: 0.9rem; margin-bottom: 5px;"><strong>Reports:</strong> ${g.reports.length}</p>
            <p style="font-size: 0.9rem; margin-bottom: 15px;"><strong>Issues:</strong> ${issuesList}</p>
            <button class="secondary-btn review-btn" data-qid="${g.questionId}" style="font-size: 0.85rem; padding: 5px 10px;">Review Question</button>
        `;
        
        const btn = card.querySelector('.review-btn');
        btn.addEventListener('click', () => openReviewModal(g.questionId, g.reports));
        
        feedbackReviewList.appendChild(card);
    });
}

function openReviewModal(qid, reports) {
    currentReviewQid = qid;
    const q = questionsBank.find(x => x.qid === qid);
    
    if (!q) {
        alert("Question data not found.");
        return;
    }
    
    revQid.textContent = q.qid;
    revTopic.textContent = q.subtopic;
    
    // Safely render question
    revQuestionText.innerHTML = '';
    const p = document.createElement('p');
    p.textContent = q.question;
    revQuestionText.appendChild(p);
    
    // Render options
    revOptions.innerHTML = '';
    q.options.forEach((opt, idx) => {
        const div = document.createElement('div');
        div.style.cssText = 'padding: 5px; margin-bottom: 5px; background: var(--bg-main); border-radius: 4px; font-size: 0.9rem;';
        div.textContent = `${idx + 1}. ${opt}`;
        revOptions.appendChild(div);
    });
    
    revCorrect.textContent = `Option ${q.correctOption}`;
    revExplanation.textContent = q.explanation;
    
    // Render user feedback
    revFeedbackList.innerHTML = '';
    reports.forEach(r => {
        const fDiv = document.createElement('div');
        fDiv.style.cssText = 'background: var(--bg-card); padding: 10px; border-radius: 6px; border: 1px dashed var(--border-color);';
        
        const dateStr = new Date(r.timestamp).toLocaleString();
        const typeEl = document.createElement('p');
        typeEl.style.cssText = 'font-weight: bold; font-size: 0.9rem; margin-bottom: 5px; color: var(--primary-color);';
        typeEl.textContent = `${r.issueType} (${dateStr}) - ${r.mode}`;
        fDiv.appendChild(typeEl);
        
        if (r.details) {
            const detEl = document.createElement('p');
            detEl.style.cssText = 'font-size: 0.9rem; margin-top: 5px; color: var(--text-color); white-space: pre-wrap;';
            detEl.textContent = `Details: ${r.details}`;
            fDiv.appendChild(detEl);
        }
        
        revFeedbackList.appendChild(fDiv);
    });
    
    reviewModal.classList.remove('hidden');
}

function updateReviewStatus(status) {
    if (!currentReviewQid) return;
    
    const statuses = getReviewStatuses();
    statuses[currentReviewQid] = {
        questionId: currentReviewQid,
        status: status,
        reviewedAt: new Date().toISOString()
    };
    
    saveReviewStatuses(statuses);
    
    reviewModal.classList.add('hidden');
    showProgressScreen(); // refresh list
}

function exportReviewData() {
    const statuses = getReviewStatuses();
    const feedbacks = getSavedFeedback();
    
    const exportData = {
        statuses: statuses,
        feedbackSnapshot: feedbacks
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "govcrackexam-feedback-review.json");
    dlAnchorElem.click();
}

function clearReviewStatus() {
    const statuses = getReviewStatuses();
    if (Object.keys(statuses).length === 0) return;
    
    if (confirm("Clear all review statuses? This will NOT delete the original feedback reports.")) {
        localStorage.removeItem('govcrackexam-feedback-review-v1');
        showProgressScreen();
    }
}

function updateQuestionHistory(quiz, answers, mode) {
    const history = getSavedHistory() || {};
    if (!history.questionHistory) history.questionHistory = {};
    
    const now = new Date().toISOString();
    
    quiz.forEach(q => {
        // Skip unanswered
        if (!answers[q.qid]) return;
        
        if (!history.questionHistory[q.qid]) {
            history.questionHistory[q.qid] = {
                attempts: 0,
                correct: 0,
                incorrect: 0,
                accuracy: 0,
                lastAttemptAt: null,
                lastResult: null,
                currentStreak: 0,
                bestStreak: 0
            };
        }
        
        let qh = history.questionHistory[q.qid];
        let isCorrect = answers[q.qid] === q.correctOption;
        
        qh.attempts++;
        if (isCorrect) {
            qh.correct++;
            qh.currentStreak++;
            if (qh.currentStreak > qh.bestStreak) qh.bestStreak = qh.currentStreak;
            qh.lastResult = 'correct';
        } else {
            qh.incorrect++;
            qh.currentStreak = 0;
            qh.lastResult = 'incorrect';
        }
        
        qh.accuracy = Math.round((qh.correct / qh.attempts) * 100);
        qh.lastAttemptAt = now;
    });
    
    saveHistory(history);
}

function renderQuestionReview() {
    const container = document.getElementById('qr-results-container');
    if (!container) return;
    
    const history = getSavedHistory() || {};
    const qh = history.questionHistory || {};
    
    if (Object.keys(qh).length === 0) {
        container.innerHTML = '<div style="padding: 15px; text-align: center; color: var(--text-muted); background: var(--card-bg); border-radius: 6px; border: 1px solid var(--border-color);">Answer some practice questions to build your question history.</div>';
        return;
    }
    
    const statusFilter = document.getElementById('qr-status-filter').value;
    const topicFilter = document.getElementById('qr-topic-filter').value;
    const diffFilter = document.getElementById('qr-diff-filter').value;
    
    let results = [];
    questionsBank.forEach(q => {
        if (qh[q.qid]) {
            const h = qh[q.qid];
            
            // Determine Status
            let status = 'None';
            if (h.attempts >= 3 && h.accuracy >= 80 && h.currentStreak >= 2) {
                status = 'Mastered';
            } else if (h.attempts >= 2 && h.accuracy < 50) {
                status = 'Needs Practice';
            } else if (h.incorrect >= 2) {
                status = 'Frequently Missed';
            } else if (h.lastResult === 'correct' && h.incorrect > 0 && h.attempts >= 2) {
                status = 'Improving';
            }
            
            let passStatus = statusFilter === 'All' || status === statusFilter;
            let passTopic = topicFilter === 'All' || q.subtopic === topicFilter;
            let passDiff = diffFilter === 'All' || (q.difficulty || 'Medium') === diffFilter;
            
            if (passStatus && passTopic && passDiff) {
                results.push({ q: q, h: h, status: status });
            }
        }
    });
    
    if (results.length === 0) {
        container.innerHTML = '<div style="padding: 15px; text-align: center; color: var(--text-muted); background: var(--card-bg); border-radius: 6px; border: 1px solid var(--border-color);">No questions match these filters yet.</div>';
        return;
    }
    
    // Sort by most recently attempted
    results.sort((a, b) => new Date(b.h.lastAttemptAt) - new Date(a.h.lastAttemptAt));
    
    let html = '';
    results.forEach(item => {
        const h = item.h;
        const q = item.q;
        const diff = q.difficulty || 'Medium';
        const color = diff === 'Easy' ? '#10b981' : (diff === 'Hard' ? '#ef4444' : '#f59e0b');
        
        let statusBadge = '';
        if (item.status !== 'None') {
            statusBadge = `<span style="font-size: 0.7rem; padding: 2px 5px; border-radius: 3px; background: rgba(255,255,255,0.1); margin-left: 5px;">${item.status}</span>`;
        }
        
        html += `
        <div class="card" style="padding: 15px; border-left: 3px solid ${color};">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                <div style="font-size: 0.85rem; color: var(--text-muted);">${q.subtopic} ${statusBadge}</div>
                <div style="font-size: 0.8rem;">Acc: ${h.accuracy}% (${h.correct}/${h.attempts})</div>
            </div>
            <p style="font-size: 0.95rem; margin-bottom: 15px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${escapeHTML(q.question)}</p>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="font-size: 0.8rem; color: ${h.lastResult === 'correct' ? 'var(--success-color)' : 'var(--danger-color)'};">
                    Last: ${h.lastResult}
                </div>
                <button class="secondary-btn" style="padding: 5px 10px; font-size: 0.8rem;" onclick="openQuestionReviewModal('${q.qid}')">Review Question</button>
            </div>
        </div>`;
    });
    
    container.innerHTML = html;
}

window.openQuestionReviewModal = function(qid) {
    const q = questionsBank.find(x => x.qid === qid);
    if (!q) return;
    
    const history = getSavedHistory() || {};
    const h = (history.questionHistory && history.questionHistory[qid]) ? history.questionHistory[qid] : null;
    
    const modal = document.getElementById('qr-modal');
    const content = document.getElementById('qr-modal-content');
    
    let hHtml = '';
    if (h) {
        hHtml = `
        <div style="display: flex; gap: 10px; margin-bottom: 20px; background: rgba(255,255,255,0.02); padding: 10px; border-radius: 6px;">
            <div style="flex: 1; text-align: center;">
                <div style="font-size: 1.1rem; font-weight: bold;">${h.attempts}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">Attempts</div>
            </div>
            <div style="flex: 1; text-align: center;">
                <div style="font-size: 1.1rem; font-weight: bold; color: var(--success-color);">${h.accuracy}%</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">Accuracy</div>
            </div>
            <div style="flex: 1; text-align: center;">
                <div style="font-size: 1.1rem; font-weight: bold;">${h.currentStreak}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">Current Streak</div>
            </div>
        </div>`;
    }
    
    let optHtml = q.options.map((opt, i) => `
        <div style="padding: 8px 12px; margin-bottom: 5px; border: 1px solid ${i+1 === q.correctOption ? 'var(--success-color)' : 'var(--border-color)'}; border-radius: 4px; background: ${i+1 === q.correctOption ? 'rgba(16, 185, 129, 0.1)' : 'transparent'};">
            ${i+1}. ${escapeHTML(opt)}
            ${i+1 === q.correctOption ? '<span style="float: right; color: var(--success-color); font-size: 0.8rem; margin-top: 3px;">Correct Answer</span>' : ''}
        </div>
    `).join('');
    
    content.innerHTML = `
        <div style="margin-bottom: 10px;">
            <span style="font-size: 0.8rem; padding: 2px 6px; background: var(--primary-color); color: white; border-radius: 4px;">${q.subtopic}</span>
            <span style="font-size: 0.8rem; padding: 2px 6px; background: var(--border-color); color: white; border-radius: 4px; margin-left: 5px;">${q.difficulty || 'Medium'}</span>
        </div>
        ${hHtml}
        <p style="font-weight: 600; margin-bottom: 15px;">${escapeHTML(q.question)}</p>
        <div style="margin-bottom: 20px;">
            ${optHtml}
        </div>
        <div class="explanation-card" style="padding-top: 15px; border-top: 1px solid var(--border-color);">
            <strong>Explanation:</strong><br>${escapeHTML(q.explanation).replace(/\n/g, '<br>')}
        </div>
    `;
    
    modal.classList.remove('hidden');
};
