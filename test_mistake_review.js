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

function extractMistakeItems(html) {
    const items = html.split('class="mistake-item').slice(1);
    return items;
}

// A. Drill with mistakes
mode = 'drill';
drillTopics = ['Syllogism'];
currentQuiz = allQuestions.filter(q => q.subtopic === 'Syllogism').slice(0, 10);
userAnswers = {};
// Answer 3 correct, 7 wrong
for(let i = 0; i < 10; i++) {
    if (i < 3) {
        userAnswers[currentQuiz[i].qid] = currentQuiz[i].correctOption;
    } else {
        let wrong = currentQuiz[i].correctOption === 1 ? 2 : 1;
        userAnswers[currentQuiz[i].qid] = wrong;
    }
}

calculateDrillResults();
let html = document.getElementById('drill-mistakes-container').innerHTML;
let items = extractMistakeItems(html);
assert(items.length === 7, "A. Drill with mistakes generated exactly 7 mistake items");

// B. Drill perfect
userAnswers = {};
for(let i = 0; i < 10; i++) {
    userAnswers[currentQuiz[i].qid] = currentQuiz[i].correctOption;
}
calculateDrillResults();
html = document.getElementById('drill-mistakes-container').innerHTML;
items = extractMistakeItems(html);
assert(items.length === 0, "B. Drill perfect generated 0 mistake items");
assert(html.includes("Perfect! No mistakes to review"), "B. Drill perfect shows perfect message");

// C. Topic Practice with mistakes
mode = 'topicPractice';
drillTopics = ['Blood Relations'];
currentQuiz = allQuestions.filter(q => q.subtopic === 'Blood Relations').slice(0, 10);
userAnswers = {};
// Answer 4 correct, 6 wrong
for(let i = 0; i < 10; i++) {
    if (i < 4) {
        userAnswers[currentQuiz[i].qid] = currentQuiz[i].correctOption;
    } else {
        let wrong = currentQuiz[i].correctOption === 1 ? 2 : 1;
        userAnswers[currentQuiz[i].qid] = wrong;
    }
}

calculateTopicPracticeResults();
html = document.getElementById('topic-practice-mistakes-container').innerHTML;
items = extractMistakeItems(html);
assert(items.length === 6, "C. Topic Practice with mistakes generated exactly 6 mistake items");

// D. Topic Practice perfect
userAnswers = {};
for(let i = 0; i < 10; i++) {
    userAnswers[currentQuiz[i].qid] = currentQuiz[i].correctOption;
}
calculateTopicPracticeResults();
html = document.getElementById('topic-practice-mistakes-container').innerHTML;
items = extractMistakeItems(html);
assert(items.length === 0, "D. Topic Practice perfect generated 0 mistake items");
assert(html.includes("Perfect! No mistakes to review"), "D. Topic Practice perfect shows perfect message");

// E, F, G, H, J - Single question specific checks
let targetQ = {
    qid: "test_xss_1",
    subtopic: "Syllogism",
    question: "Find <script>alert('xss')</script> & match.",
    options: ["<bad> 1", "<good> 2", "Option 3", "Option 4"],
    correctOption: 2,
    explanation: "Because <math> is cool \\n Next line."
};
currentQuiz = [targetQ];
userAnswers = { "test_xss_1": 1 }; // Wrong answer (Option 1)

renderMistakes('topic-practice-mistakes-container');
html = document.getElementById('topic-practice-mistakes-container').innerHTML;

// E & F. Answer mapping
assert(html.includes("Your Answer: Option 1"), "E. Incorrect answer mapped correctly");
assert(html.includes("&lt;bad&gt; 1"), "E. Option text rendered correctly");
assert(html.includes("Correct Answer: Option 2"), "F. Correct answer mapped correctly");
assert(html.includes("&lt;good&gt; 2"), "F. Correct option text rendered correctly");

// G. Explanation
assert(html.includes("Because &lt;math&gt; is cool <br> Next line."), "G. Explanation correctly rendered and escaped");

// H. Question text & XSS safety
assert(html.includes("Find &lt;script&gt;alert(&#039;xss&#039;)&lt;/script&gt; &amp; match."), "J. Question text is properly HTML escaped");
assert(!html.includes("<script>"), "J. Unescaped tags are not present");

// I. No mutation
assert(allQuestions.length === originalQuestionsLength, "I. No questions were added or removed");
assert(JSON.stringify(allQuestions) === originalQuestionsSnapshot, "I. Original question objects were not mutated");

if (testsPassed) {
    console.log("All Mistake Review tests passed.");
} else {
    process.exit(1);
}
`;

eval(mockCode + appCode + testCode);
