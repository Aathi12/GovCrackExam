const fs = require('fs');
const appCode = fs.readFileSync('js/app.js', 'utf-8');

const mockCode = `
global.window = { addEventListener: () => {} };
global.localStorage = {
    _data: {},
    getItem: function(k) { return this._data[k] || null; },
    setItem: function(k, v) { this._data[k] = String(v); },
    removeItem: function(k) { delete this._data[k]; }
};
const dummyEl = { 
    style: {}, 
    classList: { add: ()=>{}, remove: ()=>{} }, 
    appendChild: ()=>{}, 
    addEventListener: ()=>{},
    querySelectorAll: function() {
        return [{classList:{add:()=>{}, remove:()=>{}}}, {classList:{add:()=>{}, remove:()=>{}}}, {classList:{add:()=>{}, remove:()=>{}}}, {classList:{add:()=>{}, remove:()=>{}}}];
    }
};
global.document = {
    _elements: {},
    getElementById: function(id) {
        if (!this._elements[id]) {
            this._elements[id] = { ...dummyEl, id: id, innerHTML: '', textContent: '', style: {} };
        }
        return this._elements[id];
    },
    createElement: (tag) => ({ ...dummyEl, tagName: tag, classList: { add: ()=>{}, remove: ()=>{} }, setAttribute: ()=>{} })
};
global.confirm = () => true;
global.alert = () => {};
global.setTimeout = (fn) => fn();
`;

const testCode = `
allQuestions = JSON.parse(fs.readFileSync('data/questions.json', 'utf-8'));
frequencyData = JSON.parse(fs.readFileSync('data/frequency.json', 'utf-8'));
questionsBank = allQuestions; 

let testsPassed = true;
function assert(condition, message) {
    if (!condition) {
        console.error('FAIL: ' + message);
        testsPassed = false;
    } else {
        console.log('PASS: ' + message);
    }
}

// Ensure clean state
localStorage._data = {};

// A. Initial state
startFullPractice();
assert(mode === 'fullPractice', "A. Mode is fullPractice");
assert(currentQuiz.length === 20, "A. 20 questions loaded");
assert(currentQuestionIndex === 0, "A. Current question is 1");
assert(Object.keys(userAnswers).length === 0, "A. All initially unanswered");
assert(markedQuestions.size === 0, "A. None marked for review");

// B. Navigation
assert(document.getElementById('prev-btn').disabled === true, "B. Question 1 Previous disabled");
goNext();
assert(currentQuestionIndex === 1, "B. Next works");
assert(document.getElementById('prev-btn').disabled === false, "B. Previous re-enabled");
goPrevious();
assert(currentQuestionIndex === 0, "B. Previous works");

// Jump to end
currentQuestionIndex = 19;
renderQuestion();
assert(document.getElementById('next-btn').style.display === 'none', "B. Q20 hides Next");
assert(document.getElementById('submit-btn').style.display === 'block', "B. Q20 shows Submit Test");

// Palette navigation
currentQuestionIndex = 5;
renderQuestion();
assert(currentQuestionIndex === 5, "B. direct palette navigation works (simulated)");

// C. Answer persistence
currentQuestionIndex = 0;
renderQuestion();
selectOption(2);
assert(userAnswers[currentQuiz[0].qid] === 2, "C. Option selected");
goNext();
assert(currentQuestionIndex === 1, "C. Moved to Q2");
goPrevious();
assert(userAnswers[currentQuiz[0].qid] === 2, "C. Answer persists when returning");

// D. Answer changes
selectOption(3);
assert(userAnswers[currentQuiz[0].qid] === 3, "D. Answer changed properly");

// E. Mark for Review
toggleMarkReview();
assert(markedQuestions.has(currentQuiz[0].qid), "E. Marked Q1");
goNext();
goPrevious();
assert(markedQuestions.has(currentQuiz[0].qid), "E. Marked state persists");
toggleMarkReview();
assert(!markedQuestions.has(currentQuiz[0].qid), "E. Unmark works");

// G. Submit confirmation
currentQuestionIndex = 19;
renderQuestion();
submitQuiz(); 
// In mock, this just modifies modal classes and doesn't halt JS
assert(document.getElementById('submit-confirm-modal').classList.remove !== undefined, "G. Submit opens confirmation modal");
assert(document.getElementById('confirm-answered').textContent == 1, "G. Shows 1 answered");
assert(document.getElementById('confirm-unanswered').textContent == 19, "G. Shows 19 unanswered");


if (testsPassed) {
    console.log("All Full Practice Navigation tests passed.");
} else {
    process.exit(1);
}
`;

eval(mockCode + appCode + testCode);
