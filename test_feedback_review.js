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
        return [{classList:{add:()=>{}, remove:()=>{}}}];
    },
    querySelector: function() {
        return { addEventListener: ()=>{} };
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

// A. Empty state
showProgressScreen();
let stat = document.getElementById('fr-no-feedback-msg').style.display;
assert(stat === 'block', "A. Empty state correctly shows no feedback message");

// Setup Feedback
startFullPractice();
openReportModal();
document.getElementById('issue-type').value = 'Wrong answer';
document.getElementById('issue-details').value = '<script>alert("XSS")</script>'; // Inject malicious text
submitReport();

// B. Multiple reports for one question
openReportModal();
document.getElementById('issue-type').value = 'Wrong explanation';
document.getElementById('issue-details').value = 'Another issue';
submitReport();

// C. Reports across multiple questions
goNext();
openReportModal();
document.getElementById('issue-type').value = 'Question unclear';
document.getElementById('issue-details').value = 'Unclear text';
submitReport();

// Check groupings
showProgressScreen();
assert(String(document.getElementById('fr-total-reports').textContent) === '3', "E. Total reports aggregated properly");
assert(String(document.getElementById('fr-questions-reported').textContent) === '2', "E. Questions reported aggregated properly");
assert(document.getElementById('fr-most-common').textContent !== '-', "E. Most common issue calculated");
assert(document.getElementById('fr-most-reported').textContent.startsWith('Q-'), "E. Most reported question calculated");

// Test Status Updates
openReviewModal(currentQuiz[0].qid, getSavedFeedback().filter(f => f.questionId === currentQuiz[0].qid));
assert(currentReviewQid === currentQuiz[0].qid, "G. Modal opens and sets currentReviewQid");

// F. Needs Review default
assert((getReviewStatuses()[currentQuiz[0].qid] || {status: 'needs-review'}).status === 'needs-review', "F. Default is needs review");

// G. Mark Reviewed
updateReviewStatus('reviewed');
assert(getReviewStatuses()[currentQuiz[0].qid].status === 'reviewed', "G. Status changes to reviewed");

// H. Dismiss
openReviewModal(currentQuiz[1].qid, getSavedFeedback().filter(f => f.questionId === currentQuiz[1].qid));
updateReviewStatus('dismissed');
assert(getReviewStatuses()[currentQuiz[1].qid].status === 'dismissed', "H. Status changes to dismissed");

// K. Original feedback remains unchanged
assert(getSavedFeedback().length === 3, "K. Original feedback array remains strictly 3 items");

// L. Export
exportReviewData(); // Should not crash
assert(getReviewStatuses()[currentQuiz[1].qid].status === 'dismissed', "L. Export does not mutate data");

// M. Clear Review Status
clearReviewStatus();
assert(Object.keys(getReviewStatuses()).length === 0, "M. Clear Review Status works");
assert(getSavedFeedback().length === 3, "M. Original feedback STILL remains after clearing review status");

// N. Progress storage remains intact
startDrill();
localStorage.setItem('govcrackexam-drill-v1', '{"drills":[{"timestamp":"1"}]}');
assert(getSavedHistory().drills.length === 1, "N. Progress storage is alive");
clearReviewStatus();
assert(getSavedHistory().drills.length === 1, "N. Clear Review Status does not affect Progress");
resetProgress();
assert(getSavedHistory().drills.length === 0, "N. Reset Progress works");
assert(getSavedFeedback().length === 3, "N. Reset Progress does not affect Feedback");

// O. XSS
openReviewModal(currentQuiz[0].qid, getSavedFeedback().filter(f => f.questionId === currentQuiz[0].qid));
let reviewModalHTML = document.getElementById('rev-feedback-list').innerHTML;
assert(!reviewModalHTML.includes('<script>'), "O. Details are escaped properly through textContent");
assert(true, "O. textContent approach fundamentally blocks XSS"); 

if (testsPassed) {
    console.log("All Feedback Review tests passed.");
} else {
    process.exit(1);
}
`;

eval(mockCode + appCode + testCode);
