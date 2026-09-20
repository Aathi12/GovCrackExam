const fs = require('fs');

const questions = JSON.parse(fs.readFileSync('data/questions.json', 'utf-8'));

let testsPassed = true;
function assert(condition, message) {
    if (!condition) {
        console.error('FAIL: ' + message);
        testsPassed = false;
    } else {
        console.log('PASS: ' + message);
    }
}

// Exactly 179 questions
assert(questions.length === 196, "Exactly 196 questions exist");

// All IDs unique
const ids = questions.map(q => q.qid);
const uniqueIds = new Set(ids);
assert(uniqueIds.size === questions.length, "All IDs are unique");

// All required fields exist
const required = ['qid', 'question', 'options', 'correctOption', 'subtopic', 'explanation'];
const allFieldsExist = questions.every(q => required.every(field => field in q));
assert(allFieldsExist, "All required fields exist on all questions");

// All options are valid
const allOptionsValid = questions.every(q => Array.isArray(q.options) && q.options.length === 4 && q.options.every(o => typeof o === 'string' && o.trim() !== ''));
assert(allOptionsValid, "All options are valid arrays of 4 non-empty strings");

// Correct-answer references valid
const validCorrect = questions.every(q => typeof q.correctOption === 'number' && q.correctOption >= 1 && q.correctOption <= 4);
assert(validCorrect, "All correct-answer references are valid (1-4)");

// Explanations exist
const validExp = questions.every(q => typeof q.explanation === 'string' && q.explanation.trim() !== '');
assert(validExp, "Explanations exist and are non-empty strings");

// Expected topics
const expectedTopics = ["Blood Relations", "Coded Language", "Dictionary Order", "Letter-cluster Analogy / Series", "Mathematical Operations", "Syllogism", "Number/Figure Series"];
const actualTopics = new Set(questions.map(q => q.subtopic));
const topicsValid = [...actualTopics].every(t => expectedTopics.includes(t)) && actualTopics.size === 7;
assert(topicsValid, "All seven expected topics are strictly represented");

// No accidental empty question records
const noEmptyText = questions.every(q => typeof q.question === 'string' && q.question.trim() !== '');
assert(noEmptyText, "No accidental empty question text");

if (testsPassed) {
    console.log("All Question Bank Audit tests passed.");
} else {
    process.exit(1);
}
