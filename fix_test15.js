const fs = require('fs');
let js = fs.readFileSync('test_phase45_e2e_user_simulation.js', 'utf8');

js = js.replace(/setTimeout,/g, 'setTimeout: (fn) => fn(),');
js = js.replace(/localStore\['govcrackexam-feedback'\]/g, "localStore['govcrackexam-feedback-v1']");

fs.writeFileSync('test_phase45_e2e_user_simulation.js', js);
