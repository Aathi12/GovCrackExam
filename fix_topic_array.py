import re

with open('js/app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

# Fix the stray history.fullPractices = [] in calculateTopicPracticeResults
bad_snippet = """    if (!history.topicPractices) history.topicPractices = [];
        history.fullPractices = [];"""
good_snippet = """    if (!history.topicPractices) history.topicPractices = [];"""
app_js = app_js.replace(bad_snippet, good_snippet)

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(app_js)
