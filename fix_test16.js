const fs = require('fs');
let js = fs.readFileSync('test_phase45_e2e_user_simulation.js', 'utf8');

js = js.replace('querySelectorAll: () => [dummyEl, dummyEl, dummyEl, dummyEl],', 'querySelectorAll: () => [dummyEl, dummyEl, dummyEl, dummyEl],\n    querySelector: () => dummyEl,');
fs.writeFileSync('test_phase45_e2e_user_simulation.js', js);
