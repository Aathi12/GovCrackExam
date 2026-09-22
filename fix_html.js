const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace('id="adaptive-toggle"', 'id="adaptive-toggle" aria-describedby="adaptive-desc"');
html = html.replace('class="adaptive-description"', 'id="adaptive-desc" class="adaptive-description"');
fs.writeFileSync('index.html', html);
