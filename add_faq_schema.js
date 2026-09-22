const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const faqSchema = `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [{
        "@type": "Question",
        "name": "What is SSC CGL General Intelligence and Reasoning?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "It is a core section of the SSC CGL exam that tests logical thinking, pattern recognition, and analytical skills through topics like Syllogism, Blood Relations, and Analogies."
        }
      }, {
        "@type": "Question",
        "name": "Does GovCrackExam require an account?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. GovCrackExam is a 100% client-side application. No login, no accounts, and no backend infrastructure are required."
        }
      }, {
        "@type": "Question",
        "name": "Where is my progress stored?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "All your progress and feedback is stored locally on your device using your browser's localStorage. We do not track or store your data on any server."
        }
      }]
    }
    </script>
`;
html = html.replace('</head>', faqSchema + '</head>');
fs.writeFileSync('index.html', html);
