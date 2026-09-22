const fs = require('fs');
const assert = require('assert');

let failed = false;

function testPage(filename) {
    const html = fs.readFileSync(filename, 'utf8');
    
    // Check Title
    if (!html.includes('<title>')) {
        console.error(`FAIL: ${filename} missing <title>`);
        failed = true;
    }
    
    // Check Meta description
    if (!html.includes('<meta name="description"')) {
        console.error(`FAIL: ${filename} missing meta description`);
        failed = true;
    }
    
    // Check Canonical
    if (!html.includes('<link rel="canonical"')) {
        console.error(`FAIL: ${filename} missing canonical`);
        failed = true;
    }
    
    // Check Canonical domain
    if (html.includes('<link rel="canonical"') && !html.includes('https://govcrackexam.online')) {
        console.error(`FAIL: ${filename} canonical domain is not govcrackexam.online`);
        failed = true;
    }
    
    // No localhost
    if (html.includes('localhost') || html.includes('127.0.0.1')) {
        console.error(`FAIL: ${filename} contains localhost URL`);
        failed = true;
    }
    
    // Privacy
    if (html.includes('google-analytics') || html.includes('gtag') || html.includes('pixel')) {
        console.error(`FAIL: ${filename} contains tracking scripts`);
        failed = true;
    }
}

const topics = [
    "coded-language.html",
    "letter-cluster-analogy-series.html",
    "syllogism.html",
    "blood-relations.html",
    "dictionary-order.html",
    "mathematical-operations.html",
    "number-figure-series.html",
    "classification-odd-one-out.html",
    "analogy-word-number.html"
];

// Test all topic pages
topics.forEach(t => testPage(t));

// Test index
testPage('index.html');

// Index specific tests
const indexHtml = fs.readFileSync('index.html', 'utf8');
if (!indexHtml.includes('Frequently Asked Questions')) {
    console.error('FAIL: index.html missing FAQ section');
    failed = true;
}

if (!indexHtml.includes('"@type": "FAQPage"')) {
    console.error('FAIL: index.html missing FAQPage JSON-LD');
    failed = true;
}

// Topic specific tests
topics.forEach(t => {
    const html = fs.readFileSync(t, 'utf8');
    if (!html.includes('What this topic tests')) {
        console.error(`FAIL: ${t} missing educational content section (What this topic tests)`);
        failed = true;
    }
    if (!html.includes('index.html?practice=')) {
        console.error(`FAIL: ${t} missing internal link to Practice this topic`);
        failed = true;
    }
});

// JSON parsing
const questions = JSON.parse(fs.readFileSync('data/questions.json', 'utf8'));
if (questions.length !== 221) {
    console.error(`FAIL: Expected 221 questions, found ${questions.length}`);
    failed = true;
}

if (failed) {
    process.exit(1);
} else {
    console.log("PASS: All Phase 49 SEO and Content tests passed.");
}
