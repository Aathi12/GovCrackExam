import re

with open('js/app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

# 1. State variable
if "let markedQuestions = new Set();" not in app_js:
    app_js = app_js.replace("let userAnswers = {};", "let userAnswers = {};\nlet markedQuestions = new Set();")

# 2. Reset markedQuestions in all start functions
for start_func in ["function startDiagnostic() {", "function startDrill() {", "function startTopicPractice(topic) {", "function startFullPractice() {"]:
    app_js = app_js.replace(start_func, start_func + "\n    markedQuestions = new Set();")

# 3. Add UI Elements initialization
ui_elements = """const submitBtn = document.getElementById('submit-btn');
const markReviewBtn = document.getElementById('mark-review-btn');
const paletteContainer = document.getElementById('quiz-palette-container');
const palette = document.getElementById('quiz-palette');
const confirmModal = document.getElementById('submit-confirm-modal');
const confirmContinueBtn = document.getElementById('confirm-continue-btn');
const confirmSubmitBtn = document.getElementById('confirm-submit-btn');"""
app_js = app_js.replace("const submitBtn = document.getElementById('submit-btn');", ui_elements)

# 4. Add Event Listeners for new elements
event_listeners = """        submitBtn.addEventListener('click', submitQuiz);
        
        if(markReviewBtn) markReviewBtn.addEventListener('click', toggleMarkReview);
        if(confirmContinueBtn) confirmContinueBtn.addEventListener('click', () => confirmModal.classList.add('hidden'));
        if(confirmSubmitBtn) confirmSubmitBtn.addEventListener('click', () => {
            confirmModal.classList.add('hidden');
            calculateFullPracticeResults();
            switchScreen('fullPracticeResults');
        });"""
app_js = app_js.replace("submitBtn.addEventListener('click', submitQuiz);", event_listeners)

# 5. renderQuestion updates
render_question_insert = """
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
"""
app_js = app_js.replace("optionsContainer.innerHTML = '';", render_question_insert + "\n    optionsContainer.innerHTML = '';")

# 6. selectOption update
select_opt_old = """    } else {
        // Just select visually
        userAnswers[currentQuiz[currentQuestionIndex].qid] = optNum;"""
select_opt_new = """    } else {
        // Just select visually
        userAnswers[currentQuiz[currentQuestionIndex].qid] = optNum;
        if (mode === 'fullPractice') renderPalette();"""
app_js = app_js.replace(select_opt_old, select_opt_new)

# 7. Palette functions
palette_funcs = """
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
"""
app_js = app_js.replace("function goNext() {", palette_funcs + "\nfunction goNext() {")

# 8. Update submitQuiz
submit_quiz_old = """function submitQuiz() {
    if (mode === 'diagnostic') {
        calculateDiagnosticResults();
        switchScreen('results');
    } else if (mode === 'drill') {
        calculateDrillResults();
        switchScreen('drillResults');
    } else if (mode === 'topicPractice') {
        calculateTopicPracticeResults();
        switchScreen('topicPracticeResults');
    } else if (mode === 'fullPractice') {
        calculateFullPracticeResults();
        switchScreen('fullPracticeResults');
    }
}"""
submit_quiz_new = """function submitQuiz() {
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
}"""
app_js = app_js.replace(submit_quiz_old, submit_quiz_new)

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(app_js)
