const https = require('https');
const http = require('http');

let testsPassed = true;
let totalTests = 0;
let passCount = 0;
let failCount = 0;

function assert(condition, message) {
    totalTests++;
    if (!condition) {
        console.error('FAIL: ' + message);
        testsPassed = false;
        failCount++;
    } else {
        console.log('PASS: ' + message);
        passCount++;
    }
}

async function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        client.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ statusCode: res.statusCode, data, headers: res.headers }));
        }).on('error', err => reject(err));
    });
}

async function runTests() {
    const baseUrl = 'https://govcrackexam.online';
    
    try {
        console.log('Testing live site: ' + baseUrl);
        
        // 1. Homepage
        const homeRes = await fetchUrl(baseUrl + '/');
        assert(homeRes.statusCode === 200, "Homepage loaded successfully (200 OK)");
        assert(homeRes.data.includes('<title>'), "Homepage contains title");
        assert(homeRes.data.includes('221 questions'), "Homepage confirms 221 questions production bank");
        
        // 2. robots.txt
        const robotsRes = await fetchUrl(baseUrl + '/robots.txt');
        assert(robotsRes.statusCode === 200, "robots.txt loaded successfully");
        assert(robotsRes.data.includes('User-agent: *'), "robots.txt has correct format");
        assert(robotsRes.data.includes('govcrackexam.online/sitemap.xml'), "robots.txt points to sitemap");
        
        // 3. sitemap.xml
        const sitemapRes = await fetchUrl(baseUrl + '/sitemap.xml');
        assert(sitemapRes.statusCode === 200, "sitemap.xml loaded successfully");
        assert(sitemapRes.data.includes('<urlset'), "sitemap is valid XML");
        
        // 4. Assets
        const cssRes = await fetchUrl(baseUrl + '/css/styles.css');
        assert(cssRes.statusCode === 200, "CSS loaded successfully");
        
        const jsRes = await fetchUrl(baseUrl + '/js/app.js');
        assert(jsRes.statusCode === 200, "JS loaded successfully");
        
        // 5. Data JSON
        const qRes = await fetchUrl(baseUrl + '/data/questions.json');
        assert(qRes.statusCode === 200, "questions.json loaded successfully");
        try {
            const qs = JSON.parse(qRes.data);
            assert(qs.length === 221, "Live questions.json has exactly 221 questions");
        } catch (e) {
            assert(false, "Live questions.json is valid JSON");
        }
        
        // 6. Topics
        const syllogismRes = await fetchUrl(baseUrl + '/syllogism.html');
        assert(syllogismRes.statusCode === 200, "Topic page (syllogism.html) loaded successfully");
        
        // 7. 404
        const notFoundRes = await fetchUrl(baseUrl + '/404.html');
        assert(notFoundRes.statusCode === 200, "404.html loaded successfully");
        
    } catch (e) {
        console.error('Test execution failed:', e);
        testsPassed = false;
    }
    
    console.log(`\nTests completed. Passed: ${passCount}, Failed: ${failCount}, Total: ${totalTests}`);
    
    if (testsPassed) {
        console.log("All production smoke tests passed.");
    } else {
        process.exit(1);
    }
}

runTests();
