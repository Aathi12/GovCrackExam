const fs = require('fs');

const appCode = fs.readFileSync('js/app.js', 'utf-8');

const mockCode = `
let domElements = {};
const dummyEl = {
    classList: { add: () => {}, remove: () => {}, contains: () => false },
    style: {},
    textContent: '',
    innerHTML: '',
    appendChild: () => {},
    addEventListener: () => {},
    value: '',
    querySelectorAll: () => [dummyEl, dummyEl, dummyEl, dummyEl],
    querySelector: () => dummyEl,
    disabled: false,
    onclick: null
};

document = {
    getElementById: (id) => {
        if (!domElements[id]) domElements[id] = { ...dummyEl, id };
        return domElements[id];
    },
    createElement: (tag) => ({ ...dummyEl, tagName: tag }),
    addEventListener: () => {},
    body: { appendChild: () => {} }
};
window = {
    location: { search: '' },
    open: () => {},
    addEventListener: () => {}
};
navigator = {
    serviceWorker: { register: async () => ({ scope: '' }) }
};
confirm = () => true;
alert = () => {};

let localStore = {};
localStorage = {
    getItem: (key) => localStore[key] || null,
    setItem: (key, val) => { localStore[key] = val; },
    removeItem: (key) => { delete localStore[key]; }
};

const allQs = JSON.parse(fs.readFileSync('data/questions.json', 'utf8'));
const freq = JSON.parse(fs.readFileSync('data/frequency.json', 'utf8'));
fetch = async (url) => {
    if (url === 'data/questions.json') return { ok: true, json: async () => allQs };
    if (url === 'data/frequency.json') return { ok: true, json: async () => freq };
    return { json: async () => ({}) };
};
`;

const testCode = `
let testsPassed = true;
function assert(condition, message) {
    if (!condition) {
        console.error('FAIL: ' + message);
        testsPassed = false;
    } else {
        console.log('PASS: ' + message);
    }
}

async function runTests() {
    console.log('Starting Phase 63 Diagnostic Difficulty Aggregation Tests...');
    await initApp();
    
    // Setup state manually
    mode = 'diagnostic';
    currentQuiz = [
        { qid: 'q1', subtopic: 'Analogy', difficulty: 'Easy', correctOption: 1 },
        { qid: 'q2', subtopic: 'Analogy', difficulty: 'Hard', correctOption: 2 }
    ];
    userAnswers = { 'q1': 1, 'q2': 1 }; // 1 correct (Easy), 1 wrong (Hard)
    
    // (1) newly saved diagnostic summaries include difficultyPerformance
    calculateDiagnosticResults();
    
    let historyStr = localStore['govcrackexam-drill-v1'];
    let history = JSON.parse(historyStr);
    assert(history.diagnostics.length === 1, 'history.diagnostics should have 1 entry');
    assert(history.diagnostics[0].difficultyPerformance != null, '(1) Newly saved diagnostic summaries include difficultyPerformance');
    assert(history.diagnostics[0].difficultyPerformance.Easy.attempted === 1, 'Easy attempted is 1');
    assert(history.diagnostics[0].difficultyPerformance.Easy.correct === 1, 'Easy correct is 1');
    assert(history.diagnostics[0].difficultyPerformance.Hard.attempted === 1, 'Hard attempted is 1');
    assert(history.diagnostics[0].difficultyPerformance.Hard.correct === 0, 'Hard correct is 0');
    
    // (2) Progress screen's aggregate difficulty metrics correctly include saved diagnostic records
    showProgressScreen();
    let content = document.getElementById('progress-content').innerHTML;
    // We expect content to have '1 / 1' for Easy and '0 / 1' for Hard.
    assert(content.includes('Difficulty Performance'), '(2) Progress screen renders aggregate difficulty metrics');
    assert(content.includes('1 / 1'), 'Aggregate Easy correct/attempted is correctly displayed');
    assert(content.includes('0 / 1'), 'Aggregate Hard correct/attempted is correctly displayed');
    
    // (3) older records without difficultyPerformance are handled safely
    history.diagnostics.push({
        timestamp: new Date().toISOString(),
        score: 5,
        attempted: 10,
        accuracy: 50,
        topicPerformance: {}
    });
    localStore['govcrackexam-drill-v1'] = JSON.stringify(history);
    try {
        showProgressScreen();
        assert(true, '(3) Older records without difficultyPerformance are handled safely and do not break the screen');
    } catch (e) {
        assert(false, '(3) Older records broke the screen: ' + e);
    }
    
    // (4) the diagnostics history cap of 20 remains intact
    for (let i = 0; i < 25; i++) {
        calculateDiagnosticResults();
    }
    historyStr = localStore['govcrackexam-drill-v1'];
    history = JSON.parse(historyStr);
    assert(history.diagnostics.length === 20, '(4) The diagnostics history cap of 20 remains intact');
    
    // (5) existing localStorage compatibility and unrelated behavior are preserved
    assert(history.diagnosticResults != null, '(5) Existing detailed diagnosticResults is preserved (keeps only latest)');
    
    if (testsPassed) {
        console.log('All Phase 63 Diagnostic Difficulty tests passed.');
        process.exit(0);
    } else {
        process.exit(1);
    }
}

runTests();
`;

const vm = require('vm');
const context = vm.createContext({
    fs,
    require,
    console,
    process,
    setTimeout: (fn) => fn(),
    clearTimeout,
    URLSearchParams
});
vm.runInContext(mockCode + appCode + testCode, context);
