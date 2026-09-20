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

let testsPassed = true;
function assert(condition, message) {
    if (!condition) {
        console.error('FAIL: ' + message);
        testsPassed = false;
    } else {
        console.log('PASS: ' + message);
    }
}

// Helper to clear localStorage
function clearData() {
    localStorage._data = {};
    const el = document.getElementById('progress-content');
    if (el) el.innerHTML = '';
}

// 1. Empty history
clearData();
showProgressScreen();
let html = document.getElementById('progress-content').innerHTML;
assert(html.includes('No progress yet'), "Empty history shows 'No progress yet'");

// 2. Diagnostic history only
clearData();
localStorage.setItem('govcrackexam-drill-v1', JSON.stringify({
    diagnostics: [{ timestamp: new Date().toISOString(), score: 5, attempted: 15, accuracy: 33, topicPerformance: {} }]
}));
showProgressScreen();
html = document.getElementById('progress-content').innerHTML;
assert(!html.includes('No progress yet') && html.includes('Diagnostics Completed'), "Diagnostic history only renders progress screen");

// 3. Drill history only
clearData();
localStorage.setItem('govcrackexam-drill-v1', JSON.stringify({
    drills: [{ timestamp: new Date().toISOString(), topic: 'Syllogism', score: 8, attempted: 10, accuracy: 80, diagnosticAccuracy: 50, change: 30 }]
}));
showProgressScreen();
html = document.getElementById('progress-content').innerHTML;
assert(!html.includes('No progress yet') && html.includes('Drills Completed'), "Drill history only renders progress screen");

// 4. Topic Practice history only
clearData();
localStorage.setItem('govcrackexam-drill-v1', JSON.stringify({
    topicPractices: [{ timestamp: new Date().toISOString(), topic: 'Syllogism', score: 3, attempted: 10, accuracy: 30 }]
}));
showProgressScreen();
html = document.getElementById('progress-content').innerHTML;
assert(!html.includes('No progress yet') && html.includes('Topic Practice'), "Topic Practice history only renders progress screen");

// 5. All three histories together
clearData();
localStorage.setItem('govcrackexam-drill-v1', JSON.stringify({
    diagnostics: [{ timestamp: new Date().toISOString(), score: 5, attempted: 15, accuracy: 33, topicPerformance: {} }],
    drills: [{ timestamp: new Date().toISOString(), topic: 'Syllogism', score: 8, attempted: 10, accuracy: 80, diagnosticAccuracy: 50, change: 30 }],
    topicPractices: [{ timestamp: new Date().toISOString(), topic: 'Blood Relations', score: 9, attempted: 10, accuracy: 90 }]
}));
showProgressScreen();
html = document.getElementById('progress-content').innerHTML;
assert(!html.includes('No progress yet') && html.includes('Diagnostics Completed') && html.includes('Recent Drills') && html.includes('Recent Topic Practices'), "All three histories together render correctly");

if (testsPassed) {
    console.log("All UI rendering tests passed.");
} else {
    process.exit(1);
}
`;

eval(mockCode + appCode + testCode);
