const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const faqHTML = `
            <div class="faq-section" style="margin-top: 40px; padding-bottom: 30px;">
                <h3 style="color: var(--primary-color);">Frequently Asked Questions</h3>
                <dl style="margin-top: 15px;">
                    <dt style="font-weight: bold; margin-bottom: 5px;">What is SSC CGL General Intelligence and Reasoning?</dt>
                    <dd style="margin-bottom: 15px;">It is a core section of the SSC CGL exam that tests logical thinking, pattern recognition, and analytical skills through topics like Syllogism, Blood Relations, and Analogies.</dd>
                    
                    <dt style="font-weight: bold; margin-bottom: 5px;">How does GovCrackExam's Diagnostic mode work?</dt>
                    <dd style="margin-bottom: 15px;">The diagnostic quiz selects a cross-section of questions from all available topics to measure your baseline accuracy and identify your weak areas.</dd>
                    
                    <dt style="font-weight: bold; margin-bottom: 5px;">What is Weak-Topic Drill?</dt>
                    <dd style="margin-bottom: 15px;">A targeted practice session that automatically selects the topic you struggle with the most, helping you improve efficiently.</dd>
                    
                    <dt style="font-weight: bold; margin-bottom: 5px;">What is Adaptive Selection?</dt>
                    <dd style="margin-bottom: 15px;">Our adaptive algorithm sorts questions within your weak topic based on your personal history, prioritizing questions you've previously missed or found difficult.</dd>
                    
                    <dt style="font-weight: bold; margin-bottom: 5px;">How is accuracy calculated?</dt>
                    <dd style="margin-bottom: 15px;">Accuracy is calculated as the percentage of correctly answered questions out of total attempted questions for a given topic or session.</dd>
                    
                    <dt style="font-weight: bold; margin-bottom: 5px;">Does GovCrackExam require an account?</dt>
                    <dd style="margin-bottom: 15px;">No. GovCrackExam is a 100% client-side application. No login, no accounts, and no backend infrastructure are required.</dd>
                    
                    <dt style="font-weight: bold; margin-bottom: 5px;">Where is my progress stored?</dt>
                    <dd style="margin-bottom: 15px;">All your progress and feedback is stored locally on your device using your browser's <code style="background: #e2e8f0; padding: 2px 4px; border-radius: 3px; color: #000;">localStorage</code>. We do not track or store your data on any server.</dd>
                </dl>
            </div>
`;

// Insert it right before the first closing section
html = html.replace(/<\/section>/, faqHTML + '\n        </section>');
fs.writeFileSync('index.html', html);
