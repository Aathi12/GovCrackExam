import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

topic_results = """
        <!-- Topic Practice Results Screen -->
        <section id="topic-practice-results-screen" class="screen">
            <h2 id="topic-practice-name">Topic</h2>
            <div class="score-circle">
                <div id="topic-practice-score" class="score-number">0 / 0</div>
                <div id="topic-practice-accuracy" class="score-label">0% Accuracy</div>
            </div>
            
            <div class="actions" style="margin-top: 30px; display: flex; flex-direction: column; gap: 10px;">
                <button id="retake-topic-practice-btn" class="primary-btn">Practice Again</button>
                <button id="back-topic-btn" class="secondary-btn">Back to Topic</button>
                <button id="home-btn-topic-practice" class="secondary-btn" style="background-color: transparent; border: none; text-decoration: underline;">Back to Home</button>
            </div>
        </section>
"""

if 'id="topic-practice-results-screen"' not in html:
    html = html.replace('<!-- Progress Screen -->', topic_results + '        <!-- Progress Screen -->')
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
