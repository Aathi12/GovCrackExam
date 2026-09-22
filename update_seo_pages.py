import os
import re

topics = [
    ("blood-relations.html", "Blood Relations"),
    ("coded-language.html", "Coded Language"),
    ("dictionary-order.html", "Dictionary Order"),
    ("letter-cluster-analogy-series.html", "Letter-cluster Analogy / Series"),
    ("mathematical-operations.html", "Mathematical Operations"),
    ("syllogism.html", "Syllogism")
]

for filename, title in topics:
    with open(filename, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # We want: Practice [Topic] -> Start Diagnostic Quiz -> Back to Home
    
    practice_btn = f'<a href="index.html?practice={title.replace(" ", "%20")}" class="primary-btn" style="text-decoration: none; text-align: center; display: block; margin-bottom: 15px;">Practice {title}</a>'
    
    # Let's replace the actions div
    old_actions = """<div class="actions" style="margin-top: 30px; display: flex; flex-direction: column; gap: 15px;">
                    <a href="index.html" class="primary-btn" style="text-decoration: none; text-align: center; display: block;">Start Diagnostic Quiz</a>
                    <a href="index.html" class="secondary-btn" style="text-decoration: none; text-align: center; display: block;">Back to GovCrackExam Home</a>
                </div>"""
                
    new_actions = f"""<div class="actions" style="margin-top: 30px; display: flex; flex-direction: column; gap: 15px;">
                    <a href="index.html?practice={title.replace(" ", "%20")}" class="primary-btn" style="text-decoration: none; text-align: center; display: block;">Practice {title}</a>
                    <a href="index.html" class="secondary-btn" style="text-decoration: none; text-align: center; display: block;">Start Diagnostic Quiz</a>
                    <a href="index.html" class="secondary-btn" style="text-decoration: none; text-align: center; display: block; border: none; background-color: transparent; text-decoration: underline;">Back to Home</a>
                </div>"""
                
    if old_actions in html:
        html = html.replace(old_actions, new_actions)
    else:
        # Maybe whitespace differences
        # Let's use regex
        html = re.sub(r'<div class="actions".*?</div>', new_actions, html, flags=re.DOTALL)
        
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(html)
