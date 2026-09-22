const fs = require('fs');

let testsPassed = true;
function assert(condition, message) {
    if (!condition) {
        console.error('FAIL: ' + message);
        testsPassed = false;
    } else {
        console.log('PASS: ' + message);
    }
}

try {
    const auditStr = fs.readFileSync('data/phase40_quality_audit.json', 'utf-8');
    const audit = JSON.parse(auditStr);
    assert(Object.keys(audit).length === 228, "Exactly 228 audited IDs in Phase 40 file");
} catch (e) {
    console.error("Test execution failed:", e);
    testsPassed = false;
}

if (testsPassed) {
    console.log("All Phase 40 tests passed.");
} else {
    process.exit(1);
}
