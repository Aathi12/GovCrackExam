import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Add Start Full Reasoning Practice button
html = html.replace('<button id="start-diagnostic-btn" class="primary-btn">Start Diagnostic Quiz</button>',
                   '<button id="start-diagnostic-btn" class="primary-btn" style="display: block; width: 100%;">Start Diagnostic Quiz</button>\n            <button id="start-full-practice-btn" class="secondary-btn" style="margin-top: 15px; display: block; width: 100%; border: 2px solid var(--primary-color);">Start Full Reasoning Practice</button>')

# 2. Add full practice results screen
full_practice_screen = """
        <!-- Full Practice Results Screen -->
        <section id="full-practice-results-screen" class="screen">
            <h2 style="margin-bottom: 5px;">Full Reasoning Practice Complete</h2>
            
            <div class="score-circle">
                <div id="full-practice-score" class="score-number">0 / 20</div>
                <div id="full-practice-accuracy" class="score-label">0% Accuracy</div>
            </div>
            
            <div id="full-practice-topic-performance" style="margin-top: 20px; margin-bottom: 30px;">
                <!-- Injected via JS -->
            </div>
            
            <div id="full-practice-mistakes-container" style="margin-top: 30px; margin-bottom: 30px;">
                <!-- Injected via JS -->
            </div>

            <div id="full-practice-review-container" style="margin-top: 30px; margin-bottom: 20px;">
                <!-- Injected via JS -->
            </div>
            
            <div class="actions" style="margin-top: 30px; display: flex; flex-direction: column; gap: 10px;">
                <button id="retake-full-practice-btn" class="primary-btn">Retake Full Practice</button>
                <button id="home-btn-full-practice" class="secondary-btn" style="background-color: transparent; border: none; text-decoration: underline;">Back to Home</button>
            </div>
        </section>
"""

# Insert before progress-screen
html = html.replace('<!-- Progress Screen -->', full_practice_screen + '        <!-- Progress Screen -->')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
