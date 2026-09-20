const fs = require('fs');

const appCode = fs.readFileSync('js/app.js', 'utf-8');

const testCode = `
// Set up mock data
allQuestions = JSON.parse(fs.readFileSync('data/questions.json', 'utf-8'));
frequencyData = JSON.parse(fs.readFileSync('data/frequency.json', 'utf-8'));

currentQuiz = [
    allQuestions.find(q => q.subtopic === 'Syllogism'),
    allQuestions.find(q => q.subtopic === 'Blood Relations')
];
userAnswers = {};
mode = 'diagnostic';

let testsPassed = true;
function assert(condition, message) {
    if (!condition) {
        console.error('FAIL: ' + message);
        testsPassed = false;
    } else {
        console.log('PASS: ' + message);
    }
}

// 1. First diagnostic creates history record
calculateDiagnosticResults();
let history = JSON.parse(localStorage.getItem('govcrackexam-drill-v1'));
assert(history && history.diagnostics && history.diagnostics.length === 1, "First diagnostic creates history record.");

// 2. Second diagnostic creates a second record
calculateDiagnosticResults();
history = JSON.parse(localStorage.getItem('govcrackexam-drill-v1'));
assert(history.diagnostics.length === 2, "Second diagnostic creates a second record.");

// 4. Drill creates history record
mode = 'drill';
drillTopics = ['Syllogism'];
currentQuiz = allQuestions.filter(q => q.subtopic === 'Syllogism').slice(0, 10);
userAnswers = {};
calculateDrillResults();
history = JSON.parse(localStorage.getItem('govcrackexam-drill-v1'));
assert(history.drills && history.drills.length === 1, "Drill creates history record.");

// 5. Multiple drills for same topic are preserved
calculateDrillResults();
history = JSON.parse(localStorage.getItem('govcrackexam-drill-v1'));
assert(history.drills.length === 2, "Multiple drills for same topic are preserved.");

// 6. History is ordered newest first
assert(history.drills[0].timestamp >= history.drills[1].timestamp, "History is ordered newest first.");

// 7. Maximum 20 diagnostic records
for(let i=0; i<25; i++) {
    mode = 'diagnostic';
    calculateDiagnosticResults();
}
history = JSON.parse(localStorage.getItem('govcrackexam-drill-v1'));
assert(history.diagnostics.length === 20, "Maximum 20 diagnostic records.");

// 8. Maximum 50 drill records
for(let i=0; i<55; i++) {
    mode = 'drill';
    calculateDrillResults();
}
history = JSON.parse(localStorage.getItem('govcrackexam-drill-v1'));
assert(history.drills.length === 50, "Maximum 50 drill records.");


// 20. Topic Practice creates history record
mode = 'topicPractice';
drillTopics = ['Blood Relations'];
currentQuiz = allQuestions.filter(q => q.subtopic === 'Blood Relations').slice(0, 10);
userAnswers = {};
calculateTopicPracticeResults();
history = JSON.parse(localStorage.getItem('govcrackexam-drill-v1'));
assert(history.topicPractices && history.topicPractices.length === 1, "Topic Practice creates history record.");

// 21. Multiple topic practices are preserved
calculateTopicPracticeResults();
history = JSON.parse(localStorage.getItem('govcrackexam-drill-v1'));
assert(history.topicPractices.length === 2, "Multiple topic practices are preserved.");

// 22. History is ordered newest first
assert(history.topicPractices[0].timestamp >= history.topicPractices[1].timestamp, "Topic Practice History is ordered newest first.");

// 23. Maximum 50 topic practice records
for(let i=0; i<55; i++) {
    mode = 'topicPractice';
    calculateTopicPracticeResults();
}
history = JSON.parse(localStorage.getItem('govcrackexam-drill-v1'));
assert(history.topicPractices.length === 50, "Maximum 50 topic practice records.");

// 18. Reset requires confirmation
// 19. Reset deletes only progress data
let beforeReset = JSON.parse(localStorage.getItem('govcrackexam-drill-v1') || 'null');
assert(beforeReset && beforeReset.diagnosticResults, "BEFORE RESET: diagnosticResults exists.");
assert(beforeReset.diagnostics && beforeReset.diagnostics.length > 0, "BEFORE RESET: diagnostics contains history.");
assert(beforeReset.drills && beforeReset.drills.length > 0, "BEFORE RESET: drills contains history.");
assert(beforeReset.topicPractices && beforeReset.topicPractices.length > 0, "BEFORE RESET: topicPractices contains history.");

resetProgress();

let afterReset = JSON.parse(localStorage.getItem('govcrackexam-drill-v1') || 'null');
assert(afterReset !== null, "AFTER RESET: govcrackexam-drill-v1 key still exists.");
assert(JSON.stringify(afterReset.diagnosticResults) === JSON.stringify(beforeReset.diagnosticResults), "AFTER RESET: diagnosticResults is unchanged.");
assert(afterReset.diagnostics && afterReset.diagnostics.length === 0, "AFTER RESET: diagnostics is [].");
assert(afterReset.drills && afterReset.drills.length === 0, "AFTER RESET: drills is [].");
assert(afterReset.topicPractices && afterReset.topicPractices.length === 0, "AFTER RESET: topicPractices is [].");

if (testsPassed) {
    console.log("All UI logic tests passed.");
} else {
    process.exit(1);
}
`;

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
    getElementById: (id) => ({ ...dummyEl, id: id, innerHTML: '', textContent: '' }),
    createElement: (tag) => ({ ...dummyEl, tagName: tag })
};
global.confirm = () => true;
global.alert = () => {};
`;

// Evaluate app.js in this context
eval(mockCode + appCode + testCode);
