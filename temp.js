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

// Helper to get row html for Syllogism
function getSyllogismRowHTML() {
    const html = document.getElementById('progress-content').innerHTML;
    const match = html.match(/<tr>\s*<td>Syllogism<\\/td>\s*<td>(.*?)<\\/td>\s*<td>(.*?)<\\/td>\s*<td>(.*?)<\\/td>/);
    console.log(html); return match ? { latest: match[1], best: match[2], status: match[3] } : null;
}

// A. No history
clearData();
showProgressScreen();
let html = document.getElementById('progress-content').innerHTML;
assert(html.includes('No progress yet'), "A. Empty history shows 'No progress yet'");
// Note: when empty, it currently returns early.

// But if we bypass early return by having another record, we can check Syllogism empty row:
clearData();
localStorage.setItem('govcrackexam-drill-v1', JSON.stringify({
    topicPractices: [{ timestamp: new Date().toISOString(), topic: 'Blood Relations', score: 9, attempted: 10, accuracy: 90 }]
}));
showProgressScreen();
let row = getSyllogismRowHTML();
assert(row && row.latest === 'N/A' && row.best === 'N/A' && row.status.includes('-'), "A. Empty topic defaults to N/A and -");

// B. Topic Practice only
clearData();
localStorage.setItem('govcrackexam-drill-v1', JSON.stringify({
    topicPractices: [
        { timestamp: new Date(Date.now() - 10000).toISOString(), topic: 'Syllogism', accuracy: 30 },
        { timestamp: new Date().toISOString(), topic: 'Syllogism', accuracy: 40 }
    ]
}));
showProgressScreen();
row = getSyllogismRowHTML();
assert(row && row.latest === '40%' && row.best === '40%', "B. Topic Practice only shows 40% Latest and Best");

// C. Topic Practice regression
clearData();
localStorage.setItem('govcrackexam-drill-v1', JSON.stringify({
    topicPractices: [
        { timestamp: new Date(Date.now() - 20000).toISOString(), topic: 'Syllogism', accuracy: 30 },
        { timestamp: new Date(Date.now() - 10000).toISOString(), topic: 'Syllogism', accuracy: 40 },
        { timestamp: new Date().toISOString(), topic: 'Syllogism', accuracy: 20 }
    ]
}));
showProgressScreen();
row = getSyllogismRowHTML();
assert(row && row.latest === '20%' && row.best === '40%' && row.status.includes('Needs More Practice'), "C. Topic Practice regression shows Needs More Practice");

// D. Topic Practice improvement
clearData();
localStorage.setItem('govcrackexam-drill-v1', JSON.stringify({
    topicPractices: [
        { timestamp: new Date(Date.now() - 20000).toISOString(), topic: 'Syllogism', accuracy: 30 },
        { timestamp: new Date(Date.now() - 10000).toISOString(), topic: 'Syllogism', accuracy: 40 },
        { timestamp: new Date().toISOString(), topic: 'Syllogism', accuracy: 50 }
    ]
}));
showProgressScreen();
row = getSyllogismRowHTML();
assert(row && row.latest === '50%' && row.best === '50%' && row.status.includes('Improved'), "D. Topic Practice improvement shows Improved");

// E. Mixed activity types
clearData();
localStorage.setItem('govcrackexam-drill-v1', JSON.stringify({
    diagnostics: [{ timestamp: new Date(Date.now() - 30000).toISOString(), topicPerformance: { 'Syllogism': { attempted: 1, accuracy: 20 } } }],
    drills: [{ timestamp: new Date().toISOString(), topic: 'Syllogism', accuracy: 30 }],
    topicPractices: [{ timestamp: new Date(Date.now() - 10000).toISOString(), topic: 'Syllogism', accuracy: 40 }]
}));
// Timeline:
// -30s: Diag (20%)
// -10s: Prac (40%)
//   0s: Drill (30%)
// Latest should be Drill (30%), Best should be Prac (40%)
showProgressScreen();
row = getSyllogismRowHTML();
assert(row && row.latest === '30%' && row.best === '40%', "E. Mixed activity types sorts correctly by timestamp");

// F. Same accuracy
clearData();
localStorage.setItem('govcrackexam-drill-v1', JSON.stringify({
    topicPractices: [
        { timestamp: new Date(Date.now() - 10000).toISOString(), topic: 'Syllogism', accuracy: 30 },
        { timestamp: new Date().toISOString(), topic: 'Syllogism', accuracy: 30 }
    ]
}));
showProgressScreen();
row = getSyllogismRowHTML();
assert(row && row.status.includes('No Change'), "F. Same accuracy shows No Change");

// G. Reset
resetProgress();
let afterReset = JSON.parse(localStorage.getItem('govcrackexam-drill-v1') || '{}');
assert(afterReset.diagnostics && afterReset.diagnostics.length === 0, "G. Reset clears diagnostics");
assert(afterReset.drills && afterReset.drills.length === 0, "G. Reset clears drills");
assert(afterReset.topicPractices && afterReset.topicPractices.length === 0, "G. Reset clears topicPractices");

if (testsPassed) {
    console.log("All UI rendering tests passed.");
} else {
    process.exit(1);
}
`;

eval(mockCode + appCode + testCode);
