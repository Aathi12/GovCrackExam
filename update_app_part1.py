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
render_q_logic = """function renderQuestion() {
    const q = currentQuiz[currentQuestionIndex];
    quizProgress.textContent = `Question ${currentQuestionIndex + 1} / ${currentQuiz.length}`;
    questionText.textContent = q.question;
    
    // Mode specific UI
    if (mode === 'fullPractice') {
        paletteContainer.classList.remove('hidden');
        markReviewBtn.classList.remove('hidden');
        renderPalette();
        
        if (markedQuestions.has(q.qid)) {
            markReviewBtn.textContent = 'Unmark Review';
            markReviewBtn.classList.add('marked');
        } else {
            markReviewBtn.textContent = 'Mark for Review';
            markReviewBtn.classList.remove('marked');
        }
    } else {
        paletteContainer.classList.add('hidden');
        markReviewBtn.classList.add('hidden');
    }

    if (prevBtn) prevBtn.disabled = currentQuestionIndex === 0;
"""
app_js = re.sub(r'function renderQuestion\(\) \{.*?questionText\.textContent = q\.question;', render_q_logic, app_js, flags=re.DOTALL)

# In selectOption, we need to re-render palette if in fullPractice so the button turns green/answered instantly
select_opt_replace = """    if (mode === 'drill' || mode === 'topicPractice') {
        showDrillFeedback(q, optionIndex);
        
        if (optionIndex === q.correctOption && currentQuestionIndex < currentQuiz.length - 1) {
            setTimeout(goNext, 1500);
        }
    }
    
    if (mode === 'fullPractice') {
        renderPalette();
    }"""
app_js = re.sub(r'if \(mode === \'drill\' \|\| mode === \'topicPractice\'\) \{.*?(?=\n    })', select_opt_replace, app_js, flags=re.DOTALL)

# 6. Palette and mark review functions
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

# 7. replace submitQuiz
submit_quiz_new = """function submitQuiz() {
    if (mode === 'fullPractice') {
        const answered = Object.keys(userAnswers).length;
        const unanswered = currentQuiz.length - answered;
        const marked = markedQuestions.size;
        
        document.getElementById('confirm-answered').textContent = answered;
        document.getElementById('confirm-total').textContent = currentQuiz.length;
        document.getElementById('confirm-unanswered').textContent = unanswered;
        document.getElementById('confirm-marked').textContent = marked;
        
        confirmModal.classList.remove('hidden');
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
app_js = re.sub(r'function submitQuiz\(\) \{.*?switchScreen\(\'fullPracticeResults\'\);\n    }', submit_quiz_new, app_js, flags=re.DOTALL)


with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(app_js)
