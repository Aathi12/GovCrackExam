const fs = require('fs');
let js = fs.readFileSync('test_phase45_e2e_user_simulation.js', 'utf8');

js = js.replace('submitQuiz();\n    \n    history = JSON.parse(localStore[\'govcrackexam-drill-v1\']);\n    console.log(Object.keys(history)); assert(history.fullPractices', 
'submitQuiz();\n    calculateFullPracticeResults();\n    \n    history = JSON.parse(localStore[\'govcrackexam-drill-v1\']);\n    console.log(Object.keys(history)); assert(history.fullPractices');

fs.writeFileSync('test_phase45_e2e_user_simulation.js', js);
