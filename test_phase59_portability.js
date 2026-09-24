const fs = require('fs');

let failed = false;
function assert(condition, message) {
    if (!condition) {
        console.error('FAIL: ' + message);
        failed = true;
    }
}

// Ensure the UI controls exist in index.html
const html = fs.readFileSync('index.html', 'utf8');
assert(html.includes('exportProgress()'), 'Missing exportProgress() in HTML');
assert(html.includes('id="import-file"'), 'Missing import-file input in HTML');
assert(html.includes('id="import-modal"'), 'Missing import-modal in HTML');
assert(html.includes('aria-modal="true"'), 'Import modal lacks accessibility properties');

// Ensure functions exist in app.js
const appJs = fs.readFileSync('js/app.js', 'utf8');
assert(appJs.includes('function exportProgress()'), 'Missing exportProgress() in app.js');
assert(appJs.includes('function handleImportFile(event)'), 'Missing handleImportFile() in app.js');
assert(appJs.includes('function validateAndPreviewImport(data)'), 'Missing validateAndPreviewImport() in app.js');
assert(appJs.includes('function executeImport()'), 'Missing executeImport() in app.js');

// Verify privacy and strict local logic
assert(!appJs.includes('fetch(') || appJs.split('fetch(').length === 4, 'app.js contains unexpected fetch calls (only local JSON files expected)');
// The above check expects 3 fetch calls (questions.json, frequency.json, metadata.json). We check if it's 3 by looking at occurrences. Wait, length === 4 means 3 occurrences.
assert(!appJs.includes('XMLHttpRequest'), 'app.js contains XMLHttpRequest');
assert(!appJs.includes('analytics'), 'app.js contains analytics references');

// Verify validation rules exist in code
assert(appJs.includes('data.format !== "govcrackexam-progress-backup"'), 'Missing format validation');
assert(appJs.includes('data.version !== 1'), 'Missing version validation');
assert(appJs.includes('typeof drillData !== \'object\' || drillData === null'), 'Missing strict object validation for progress');

// Verify question bank hash is embedded
const expectedHash = "2d5596839f832e29603259c6703b2283864e8983504e082ed06e4627aca490dc";
assert(appJs.includes(expectedHash), 'Missing expected question bank hash in portability logic');

// Verify memory backup for safety
assert(appJs.includes('sessionStorage.setItem'), 'Missing memory backup safety mechanism');

// Ensure question bank content is NOT exported
// We check that exportProgress constructs a specific object shape without referencing `questionsBank`
const exportFunctionChunk = appJs.split('function exportProgress()')[1].split('}')[0];
assert(!exportFunctionChunk.includes('questionsBank'), 'exportProgress function appears to leak the questionsBank variable');

if (failed) {
    process.exit(1);
} else {
    console.log('PASS: Data Portability (Export/Import) verified locally.');
}
