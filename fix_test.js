const fs = require('fs');
let js = fs.readFileSync('test_phase45_e2e_user_simulation.js', 'utf8');
js = js.replace('console.error("Error loading application data:", error);', 'console.error("Error loading application data:", error, error.stack);');
fs.writeFileSync('test_phase45_e2e_user_simulation.js', js);
