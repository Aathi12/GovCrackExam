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

console.log("Starting Phase 61 Static PWA Tests...");

// 1. Manifest Validation
assert(fs.existsSync('manifest.json'), "manifest.json exists");
if (fs.existsSync('manifest.json')) {
    try {
        const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
        assert(manifest.start_url === '/', "start_url is root (/)");
        assert(manifest.display === 'standalone', "display mode is standalone");
        assert(manifest.icons && manifest.icons.length >= 2, "icons are defined in manifest");
    } catch (e) {
        assert(false, "manifest.json is valid JSON");
    }
}

// 2. Service Worker exists and has required logic
assert(fs.existsSync('sw.js'), "sw.js exists");
const swContent = fs.readFileSync('sw.js', 'utf8');
assert(swContent.includes('self.addEventListener(\'install\''), "sw.js contains install event listener");
assert(swContent.includes('self.addEventListener(\'fetch\''), "sw.js contains fetch event listener");
assert(swContent.includes('self.addEventListener(\'activate\''), "sw.js contains activate event listener");
assert(swContent.includes('caches.delete(cacheName)'), "sw.js contains cache cleanup logic");
assert(swContent.includes('cacheName.startsWith(\'govcrackexam-cache-\')'), "sw.js only deletes caches owned by this application");

// 3. Icons exist
assert(fs.existsSync('icon-192x192.png'), "192x192 icon exists");
assert(fs.existsSync('icon-512x512.png'), "512x512 icon exists");

// 4. HTML Integration
const indexHtml = fs.readFileSync('index.html', 'utf8');
assert(indexHtml.includes('rel="manifest" href="/manifest.json"'), "index.html includes manifest link");

// 5. App.js SW Registration
const appJs = fs.readFileSync('js/app.js', 'utf8');
assert(appJs.includes('navigator.serviceWorker.register'), "app.js registers service worker");
assert(appJs.includes('registration.addEventListener(\'updatefound\''), "app.js listens for updates");
assert(appJs.includes('showUpdateBanner'), "app.js shows update banner");
assert(appJs.includes('window.location.reload()'), "app.js handles reload on controllerchange");

if (testsPassed) {
    console.log("All static PWA tests passed.");
} else {
    process.exit(1);
}
