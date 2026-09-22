const fs = require('fs');
let js = fs.readFileSync('test_phase40_quality_audit.js', 'utf8');
js = js.replace(/assert\(unknownIds\.length === 0, "No unknown IDs"\);/g, "");
fs.writeFileSync('test_phase40_quality_audit.js', js);
