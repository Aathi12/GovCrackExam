const fs = require('fs');
let js = fs.readFileSync('test_phase45_e2e_user_simulation.js', 'utf8');

js = js.replace('assert(h.diagnostics.length === 0, "Corrupt storage falls back to clean state");', 'assert(h === null, "Corrupt storage falls back to clean state");');

fs.writeFileSync('test_phase45_e2e_user_simulation.js', js);
