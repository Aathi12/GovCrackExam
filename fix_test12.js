const fs = require('fs');
let js = fs.readFileSync('test_phase45_e2e_user_simulation.js', 'utf8');

js = js.replace('assert(history.fullPractices && history.fullPractices.length >= 1, "Full practice saved to history");', 'console.log(Object.keys(history)); assert(history.fullPractices && history.fullPractices.length >= 1, "Full practice saved to history");');

fs.writeFileSync('test_phase45_e2e_user_simulation.js', js);
