const fs = require('fs');
const path = require('path');

const dir = __dirname;
const htmlFiles = fs.readdirSync(dir).filter(file => file.endsWith('.html'));

const manifestTag = '\n    <link rel="manifest" href="/manifest.json">\n    <link rel="apple-touch-icon" href="/icon-192x192.png">';

htmlFiles.forEach(file => {
    const filepath = path.join(dir, file);
    let content = fs.readFileSync(filepath, 'utf8');

    // Skip if already added
    if (content.includes('rel="manifest"')) {
        console.log(`Manifest already in ${file}`);
        return;
    }

    // Add manifest tag after the theme-color meta tag or title
    if (content.includes('<meta name="theme-color" content="#0f4c81">')) {
        content = content.replace('<meta name="theme-color" content="#0f4c81">', '<meta name="theme-color" content="#0f4c81">' + manifestTag);
    } else if (content.includes('</head>')) {
        content = content.replace('</head>', '    <meta name="theme-color" content="#0f4c81">' + manifestTag + '\n</head>');
    }
    
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`Updated ${file}`);
});
