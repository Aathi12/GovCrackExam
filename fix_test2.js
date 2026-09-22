const fs = require('fs');
let js = fs.readFileSync('test_phase45_e2e_user_simulation.js', 'utf8');

js = js.replace("if (url === 'data/questions.json') return { json: async () => allQs };", "if (url === 'data/questions.json') return { ok: true, json: async () => allQs };");
js = js.replace("if (url === 'data/frequency.json') return { json: async () => freq };", "if (url === 'data/frequency.json') return { ok: true, json: async () => freq };");

fs.writeFileSync('test_phase45_e2e_user_simulation.js', js);
