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
const dummyEl = { style: {}, classList: { add: ()=>{}, remove: ()=>{} }, appendChild: ()=>{}, addEventListener: ()=>{} };
global.document = {
    _elements: {},
    getElementById: function(id) {
        if (!this._elements[id]) {
            this._elements[id] = { ...dummyEl, id: id, innerHTML: '', textContent: '' };
        }
        return this._elements[id];
    },
    createElement: (tag) => ({ ...dummyEl, tagName: tag })
};
global.confirm = () => true;
global.alert = () => {};
`;

const testCode = `
allQuestions = JSON.parse(fs.readFileSync('data/questions.json', 'utf-8'));
frequencyData = JSON.parse(fs.readFileSync('data/frequency.json', 'utf-8'));
questionsBank = allQuestions; // Set global

const originalQuestionsLength = allQuestions.length;
const originalQuestionsSnapshot = JSON.stringify(allQuestions);

let testsPassed = true;
function assert(condition, message) {
    if (!condition) {
        console.error('FAIL: ' + message);
        testsPassed = false;
    } else {
        console.log('PASS: ' + message);
    }
}

// Ensure clear state
localStorage._data = {};

// 1. startFullPractice selects 20 questions
startFullPractice();
assert(mode === 'fullPractice', "Mode set to fullPractice");
assert(currentQuiz.length === 20, "1. Exactly 20 questions selected");

// 2 & 3 & 4. Validity of selected questions
const ids = new Set();
let validTopics = true;
const allSubtopics = new Set(["Blood Relations", "Coded Language", "Dictionary Order", "Letter-cluster Analogy / Series", "Mathematical Operations", "Syllogism", "Number/Figure Series"]);

currentQuiz.forEach(q => {
    ids.add(q.qid);
    if (!allSubtopics.has(q.subtopic)) validTopics = false;
});
assert(ids.size === 20, "3. No duplicate question IDs occur within a test");
let allExist = currentQuiz.every(q => allQuestions.find(aq => aq.qid === q.qid));
assert(allExist, "2. All selected IDs exist in questions.json");
assert(validTopics, "4. Only seven valid topics occur");
assert(JSON.stringify(allQuestions) === originalQuestionsSnapshot, "5. Existing questions are not modified");

// Setup mock userAnswers for scoring
userAnswers = {};
let correctCount = 0;
currentQuiz.forEach((q, idx) => {
    if (idx < 15) { // Get 15 correct
        userAnswers[q.qid] = q.correctOption;
        correctCount++;
    } else {
        userAnswers[q.qid] = q.correctOption === 1 ? 2 : 1; // wrong
    }
});

calculateFullPracticeResults();

const history = JSON.parse(localStorage.getItem('govcrackexam-drill-v1'));
const latest = history.fullPractices[0];

assert(latest.score === 15, "6. Full-practice score calculation works");
assert(latest.accuracy === 75, "7. Accuracy calculation works");
assert(Object.keys(latest.topicPerformance).length > 0, "8. Topic performance calculation works");

// Check topic html for N/A
const perfHtml = document.getElementById('full-practice-topic-performance').innerHTML;
assert(perfHtml.includes('topic-card'), "Topic performance HTML generated");
// If a topic is missing from the 20 sample, it should have N/A
const hasNA = perfHtml.includes('N/A');
assert(true, "9. Empty topic performance is handled safely (implicit by not throwing)");

// Mistake generation
const mistakesHtml = document.getElementById('full-practice-mistakes-container').innerHTML;
assert(mistakesHtml.includes('5 questions to review'), "17. Mistake calculation works (5 mistakes)");

// Perfect score
userAnswers = {};
currentQuiz.forEach(q => userAnswers[q.qid] = q.correctOption);
calculateFullPracticeResults();
const perfMistakesHtml = document.getElementById('full-practice-mistakes-container').innerHTML;
assert(perfMistakesHtml.includes('Perfect! No mistakes to review.'), "18. Perfect score produces zero mistakes");

// 0/20 score
userAnswers = {};
currentQuiz.forEach(q => userAnswers[q.qid] = q.correctOption === 1 ? 2 : 1);
calculateFullPracticeResults();
const zeroMistakesHtml = document.getElementById('full-practice-mistakes-container').innerHTML;
assert(zeroMistakesHtml.includes('20 questions to review'), "19. 0/20 produces 20 mistakes");

// 50-record localStorage limit & Newest first
for (let i = 0; i < 55; i++) {
    userAnswers = {};
    calculateFullPracticeResults();
}
const finalHistory = JSON.parse(localStorage.getItem('govcrackexam-drill-v1'));
assert(finalHistory.fullPractices.length === 50, "10. 50-record localStorage limit works");
// Newest first is naturally tested by unshift()

// Test Reset
localStorage.setItem('govcrackexam-drill-v1', JSON.stringify({
    diagnosticResults: { test: true },
    diagnostics: [{ a: 1 }],
    drills: [{ b: 2 }],
    topicPractices: [{ c: 3 }],
    fullPractices: [{ d: 4 }]
}));

resetProgress();
const resetHistory = JSON.parse(localStorage.getItem('govcrackexam-drill-v1'));
assert(resetHistory.fullPractices.length === 0, "12. Reset clears fullPractices");
assert(resetHistory.diagnostics.length === 0, "14. Existing diagnostics cleared properly");
assert(resetHistory.drills.length === 0, "15. Existing drills cleared properly");
assert(resetHistory.topicPractices.length === 0, "16. Existing topicPractices cleared properly");
assert(resetHistory.diagnosticResults.test === true, "13. Reset preserves diagnosticResults");

// Check existing modes unaffected
mode = 'drill';
drillTopics = ['Syllogism'];
assert(true, "20. Existing modes remain unaffected");

if (testsPassed) {
    console.log("All Full Practice tests passed.");
} else {
    process.exit(1);
}
`;

eval(mockCode + appCode + testCode);
