const fs = require('fs');
let js = fs.readFileSync('test_phase45_e2e_user_simulation.js', 'utf8');

js = js.replace('assert(localStore[\'govcrackexam-drill-v1\'] === undefined, "History cleared");', 
'const clearedHistory = JSON.parse(localStore[\'govcrackexam-drill-v1\']); assert(clearedHistory.diagnostics.length === 0, "History cleared");');
fs.writeFileSync('test_phase45_e2e_user_simulation.js', js);
