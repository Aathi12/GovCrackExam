const fs = require('fs');

let failed = false;
function assert(condition, message) {
    if (!condition) {
        console.error('FAIL: ' + message);
        failed = true;
    }
}

// A. QUESTION BANK
assert(fs.existsSync('data/questions.json'), 'questions.json exists');
const qs = JSON.parse(fs.readFileSync('data/questions.json', 'utf8'));
assert(qs.length === 221, `Expected 221 questions, got ${qs.length}`);
const uniqueIds = new Set(qs.map(q => q.id || q.qid));
assert(uniqueIds.size === 221, `Expected 221 unique IDs, got ${uniqueIds.size}`);

// B. TOPICS
const topics = new Set(qs.map(q => q.subtopic));
assert(topics.size === 9, `Expected 9 topics, got ${topics.size}`);

// C. DIFFICULTY
let diffCounts = { Easy: 0, Medium: 0, Hard: 0 };
qs.forEach(q => diffCounts[q.difficulty] = (diffCounts[q.difficulty] || 0) + 1);
assert(diffCounts.Easy === 3, `Expected 3 Easy, got ${diffCounts.Easy}`);
assert(diffCounts.Medium === 137, `Expected 137 Medium, got ${diffCounts.Medium}`);
assert(diffCounts.Hard === 81, `Expected 81 Hard, got ${diffCounts.Hard}`);
assert(diffCounts.Easy + diffCounts.Medium + diffCounts.Hard === 221, 'Difficulty sum must equal 221');

// D. FREQUENCY
assert(fs.existsSync('data/frequency.json'), 'frequency.json exists');
const freq = JSON.parse(fs.readFileSync('data/frequency.json', 'utf8'));
topics.forEach(t => {
    assert(freq[t] !== undefined, `Frequency missing for topic: ${t}`);
});

// E. METADATA
assert(fs.existsSync('data/project_metadata.json'), 'project_metadata.json exists');
const meta = JSON.parse(fs.readFileSync('data/project_metadata.json', 'utf8'));
assert(meta.questions === 221, `Meta questions: ${meta.questions}`);
assert(meta.topics === 9, `Meta topics: ${meta.topics}`);
assert(meta.difficulty.easy === 3, 'Meta Easy difficulty check');
assert(meta.difficulty.medium === 137, 'Meta Medium difficulty check');
assert(meta.difficulty.hard === 81, 'Meta Hard difficulty check');

// F. PRIVACY
const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
htmlFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    assert(!content.includes('google-analytics'), `${file} contains Google Analytics`);
    assert(!content.includes('gtag'), `${file} contains gtag`);
    assert(!content.includes('pixel'), `${file} contains tracking pixel`);
});

// G. PRODUCTION URL SAFETY
htmlFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    assert(!content.includes('localhost'), `${file} contains localhost`);
    assert(!content.includes('127.0.0.1'), `${file} contains 127.0.0.1`);
});

if (failed) {
    process.exit(1);
} else {
    console.log('PASS: Release baseline verified.');
}
