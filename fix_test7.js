const fs = require('fs');
let js = fs.readFileSync('test_phase45_e2e_user_simulation.js', 'utf8');

js = js.replace('currentDrillTopic === \'Syllogism\'', 'drillTopics[0] === \'Syllogism\'');
fs.writeFileSync('test_phase45_e2e_user_simulation.js', js);
