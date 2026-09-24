const fs = require('fs');

let failed = false;
function assert(condition, message) {
    if (!condition) {
        console.error('FAIL: ' + message);
        failed = true;
    }
}

const readme = fs.readFileSync('README.md', 'utf8');
const projectState = fs.readFileSync('PROJECT_STATE.md', 'utf8');
const meta = JSON.parse(fs.readFileSync('data/project_metadata.json', 'utf8'));

const contents = {
    'README.md': readme,
    'PROJECT_STATE.md': projectState
};

for (const [file, content] of Object.entries(contents)) {
    // Current-state claims check (we don't strictly ban historical mentions, 
    // but the actual current claims should exist).
    assert(content.includes('221'), `${file} must explicitly mention 221 questions`);
    assert(content.includes('9'), `${file} must explicitly mention 9 topics`);
    
    // Specifically ensure it does not falsely claim the *current* state is 128
    if (file === 'README.md') {
        assert(!content.includes('128 independently verified questions'), `${file} claims 128 questions`);
        assert(!content.includes('6 subtopics'), `${file} claims 6 subtopics`);
    }
}

// Check PROJECT_STATE for specific numbers
assert(projectState.includes('Easy: 0'), 'PROJECT_STATE missing Easy: 0');
assert(projectState.includes('Medium: 147'), 'PROJECT_STATE missing Medium: 147');
assert(projectState.includes('Hard: 74'), 'PROJECT_STATE missing Hard: 74');
assert(projectState.includes('251 occurrences'), 'PROJECT_STATE missing corpus count 251');

if (failed) {
    process.exit(1);
} else {
    console.log('PASS: Documentation consistency verified.');
}
