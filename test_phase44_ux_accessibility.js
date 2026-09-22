const fs = require('fs');

let testsPassed = true;
function assert(condition, message) {
    if (!condition) {
        console.error('FAIL: ' + message);
        testsPassed = false;
    } else {
        console.log('PASS: ' + message);
    }
}

try {
    const html = fs.readFileSync('index.html', 'utf8');
    
    // Modals
    assert(html.includes('role="dialog"') && html.includes('aria-modal="true"'), "Modals have accessibility attributes");
    assert(html.includes('aria-labelledby="qr-modal-title"'), "Modals have aria-labelledby");
    
    // Buttons
    assert(html.includes('aria-label="Close"'), "Close buttons have aria-label");
    assert(!html.includes('<span id="qr-close-icon"'), "Close icon is no longer a span");
    
    // Adaptive Toggle
    assert(html.includes('aria-describedby="adaptive-desc"'), "Adaptive toggle has aria-describedby");
    assert(html.includes('id="adaptive-desc"'), "Adaptive description has id");
    
    // Check main components
    const js = fs.readFileSync('js/app.js', 'utf8');
    assert(js.includes("btn.className = 'option'"), "Options remain buttons");

    const css = fs.readFileSync('css/styles.css', 'utf8');
    assert(css.includes("button:focus"), "Focus visible styles exist");
    
} catch (e) {
    console.error(e);
    testsPassed = false;
}

if (testsPassed) process.exit(0);
else process.exit(1);
