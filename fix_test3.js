const fs = require('fs');
let js = fs.readFileSync('test_phase45_e2e_user_simulation.js', 'utf8');

js = js.replace('value: \'\',', 'value: \'\',\n    querySelectorAll: () => [],');
fs.writeFileSync('test_phase45_e2e_user_simulation.js', js);
