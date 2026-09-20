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
    classList: { add: ()=>{}, remove: ()=>{}, contains: ()=>false }, 
    appendChild: ()=>{}, 
    addEventListener: ()=>{},
    querySelectorAll: function() {
        return [{classList:{add:()=>{}, remove:()=>{}}}, {classList:{add:()=>{}, remove:()=>{}}}, {classList:{add:()=>{}, remove:()=>{}}}, {classList:{add:()=>{}, remove:()=>{}}}];
    },
    value: '',
    click: ()=>{}
};
global.document = {
    _elements: {},
    getElementById: function(id) {
        if (!this._elements[id]) {
            this._elements[id] = { ...dummyEl, id: id, innerHTML: '', textContent: '', style: {}, classList: { add: ()=>{}, remove: ()=>{}, contains: ()=>false } };
        }
        return this._elements[id];
    },
    createElement: (tag) => ({ ...dummyEl, tagName: tag, classList: { add: ()=>{}, remove: ()=>{} }, setAttribute: ()=>{} }),
    addEventListener: ()=>{}
};
global.confirm = () => true;
global.alert = () => {};
global.setTimeout = (fn, ms) => fn(); // Execute immediately
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
assert(getSavedFeedback().length === 0, "A. No feedback returns zero");

// B. Submission
startFullPractice();
openReportModal();
document.getElementById('issue-type').value = 'Wrong answer';
document.getElementById('issue-details').value = 'Test details';
submitReport();

let fbs = getSavedFeedback();
assert(fbs.length === 1, "B. Valid feedback record created");
assert(fbs[0].timestamp !== undefined, "B. Timestamp exists");
assert(fbs[0].questionId === currentQuiz[0].qid, "B. questionId exists");
assert(fbs[0].mode === 'fullPractice', "B. mode exists");
assert(fbs[0].issueType === 'Wrong answer', "B. issueType exists");

// C. Optional details
assert(fbs[0].details === 'Test details', "C. details stored");

openReportModal();
document.getElementById('issue-details').value = '';
submitReport();
fbs = getSavedFeedback();
assert(fbs[0].details === '', "C. empty details allowed");

// D. Multiple reports
goNext(); // moves to Q2
openReportModal();
document.getElementById('issue-type').value = 'Question unclear';
submitReport();
fbs = getSavedFeedback();
assert(fbs.length === 3, "D. multiple reports allowed");
assert(fbs[0].questionId === currentQuiz[1].qid, "D. different question ID stored");

// E. Limit
for (let i = 0; i < 110; i++) {
    openReportModal();
    submitReport();
}
fbs = getSavedFeedback();
assert(fbs.length === 100, "E. Storage does not exceed 100 limit");

// F. Export
exportFeedback();
fbs = getSavedFeedback();
assert(fbs.length === 100, "F. export does not mutate stored records");

// G. Clear
clearStoredFeedback();
assert(getSavedFeedback().length === 0, "G. Clear feedback works");

// H. Regression
startDrill();
localStorage.setItem('govcrackexam-drill-v1', '{"drills":[{"timestamp":"1"}]}');
assert(getSavedHistory().drills.length === 1, "H. Drill history setup");

openReportModal();
submitReport();
assert(getSavedFeedback().length === 1, "H. Feedback added");

resetProgress();
assert(getSavedFeedback().length === 1, "H. existing feedback remains intact after resetProgress()");
assert(getSavedHistory().drills.length === 0, "H. existing progress reset correctly");

if (testsPassed) {
    console.log("All Feedback tests passed.");
} else {
    process.exit(1);
}
`;

eval(mockCode + appCode + testCode);
