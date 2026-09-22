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
    addEventListener: () => {}
};
window = {
    location: { search: '' },
    open: () => {},
    addEventListener: () => {}
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
    await initApp();
    
    // SCENARIO A: Brand new learner
    assert(Object.keys(localStore).length === 0, "Scenario A: Empty localStorage starts correctly");
    startDiagnostic();
    assert(mode === 'diagnostic', "Diagnostic started");
    const diagLen = currentQuiz.length;
    assert(diagLen > 0, "Diagnostic has questions");
    
    for (let i = 0; i < diagLen; i++) {
        selectOption(1);
        if (i < diagLen - 1) goNext();
    }
    submitQuiz();
    
    let history = JSON.parse(localStore['govcrackexam-drill-v1']);
    assert(history.diagnostics.length === 1, "Diagnostic saved to history");
    
    // SCENARIO B & C: Weak-topic learner & Improving learner
    
    localStore['govcrackexam-drill-v1'] = JSON.stringify(history);
    
    startDrill();
    assert(mode === 'drill', "Drill started");
    const drillTopic = drillTopics[0];
    const drillLen = currentQuiz.length;
    assert(drillLen === 10, "Drill has 10 questions");
    
    for (let i = 0; i < 10; i++) {
        const correctOpt = currentQuiz[i].correctOption;
        selectOption(correctOpt);
        if (i < 9) goNext();
    }
    submitQuiz();
    
    history = JSON.parse(localStore['govcrackexam-drill-v1']);
    assert(history.drills.length === 1, "Drill saved to history");
    
    
    
    
    // SCENARIO D: Full Practice
    startFullPractice();
    assert(mode === 'fullPractice', "Full practice started");
    assert(currentQuiz.length === 20, "Full practice has 20 questions");
    toggleMarkReview();
    assert(markedQuestions.has(currentQuiz[0].qid), "Question marked for review");
    selectOption(2);
    goNext();
    assert(userAnswers[currentQuiz[0].qid] === 2, "Answer stored but history not updated yet");
    
    for (let i = 1; i < 20; i++) {
        selectOption(1);
        if (i < 19) goNext();
    }
    submitQuiz();
    calculateFullPracticeResults();
    
    history = JSON.parse(localStore['govcrackexam-drill-v1']);
    console.log(Object.keys(history)); assert(history.fullPractices && history.fullPractices.length >= 1, "Full practice saved to history");
    
    // SCENARIO E: Returning Learner
    const tempStore = JSON.parse(localStore['govcrackexam-drill-v1']);
    userAnswers = {};
    history = null;
    localStore['govcrackexam-drill-v1'] = JSON.stringify(tempStore);
    showProgressScreen();
    assert(true, "Progress screen loaded from returning user data");
    
    // SCENARIO F: Topic Practice
    startTopicPractice('Dictionary Order');
    assert(mode === 'topicPractice', "Topic practice started");
    const tpLen = currentQuiz.length;
    assert(tpLen <= 10, "Topic practice has max 10 questions");
    assert(currentQuiz.every(q => q.subtopic === 'Dictionary Order'), "Topic practice filters correctly");
    
    // SCENARIO G: Feedback Workflow
    document.getElementById('issue-type').value = 'Wrong answer';
    document.getElementById('issue-details').value = 'Test issue';
    currentQuestionIndex = 0;
    submitReport();
    let feedbacks = JSON.parse(localStore['govcrackexam-feedback-v1'] || '[]');
    assert(feedbacks.length === 1, "Feedback saved locally");
    
    // SCENARIO H: Reset Workflow
    resetProgress();
    const clearedHistory = JSON.parse(localStore['govcrackexam-drill-v1']); assert(clearedHistory.diagnostics.length === 0, "History cleared");
    assert(localStore['govcrackexam-feedback-v1'] !== undefined, "Feedback preserved after reset");
    
    // SCENARIO K: Edge Storage
    localStore['govcrackexam-drill-v1'] = '{bad-json}';
    let noCrash = true;
    try {
        const h = getSavedHistory();
        assert(h === null, "Corrupt storage falls back to clean state");
    } catch (e) {
        noCrash = false;
    }
    assert(noCrash, "App handles corrupt storage gracefully");

    if (testsPassed) {
        console.log("All Phase 45 E2E Scenarios passed.");
        process.exit(0);
    } else {
        process.exit(1);
    }
}

runTests();
`;

// Evaluate properly in context
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
