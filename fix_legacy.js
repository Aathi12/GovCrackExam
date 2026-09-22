const fs = require('fs');

let js = fs.readFileSync('test_phase40_quality_audit.js', 'utf8');
js = js.replace('221', '228');
fs.writeFileSync('test_phase40_quality_audit.js', js);

js = fs.readFileSync('test_phase35_difficulty.js', 'utf8');
js = js.replace('Object.keys(difficultyMap).length === 221, "1. exactly 221 difficulty entries"', 'Object.keys(difficultyMap).length === 228, "1. exactly 228 difficulty entries"');
fs.writeFileSync('test_phase35_difficulty.js', js);
