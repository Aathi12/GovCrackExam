const fs = require('fs');
let js = fs.readFileSync('test_phase45_e2e_user_simulation.js', 'utf8');

js = js.replace("assert(drillTopics[0] === 'Syllogism', \"Drill selected weak topic. Actual: \" + drillTopics[0]);", "console.log('Priorities:', topicPriorities); assert(drillTopics[0] === 'Syllogism', \"Drill selected weak topic. Actual: \" + drillTopics[0]);");

fs.writeFileSync('test_phase45_e2e_user_simulation.js', js);
