import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Add mistake container to drill-results-screen before actions
drill_mistakes = """
            <div id="drill-mistakes-container" style="margin-top: 30px; margin-bottom: 20px;"></div>
"""
if 'id="drill-mistakes-container"' not in html:
    html = html.replace('<div class="actions" style="margin-top: 30px; display: flex; flex-direction: column; gap: 10px;">\n                <button id="retake-drill-btn"', drill_mistakes + '            <div class="actions" style="margin-top: 30px; display: flex; flex-direction: column; gap: 10px;">\n                <button id="retake-drill-btn"')

# Add mistake container to topic-practice-results-screen before actions
topic_mistakes = """
            <div id="topic-practice-mistakes-container" style="margin-top: 30px; margin-bottom: 20px;"></div>
"""
if 'id="topic-practice-mistakes-container"' not in html:
    html = html.replace('<div class="actions" style="margin-top: 30px; display: flex; flex-direction: column; gap: 10px;">\n                <button id="retake-topic-practice-btn"', topic_mistakes + '            <div class="actions" style="margin-top: 30px; display: flex; flex-direction: column; gap: 10px;">\n                <button id="retake-topic-practice-btn"')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
