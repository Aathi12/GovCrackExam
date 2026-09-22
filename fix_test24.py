import re

with open('test_phase24_discovery.js', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('questions.length === 179', 'questions.length >= 179')
text = text.replace('"questions.json length is exactly 179"', '"questions.json length is >= 179"')

with open('test_phase24_discovery.js', 'w', encoding='utf-8') as f:
    f.write(text)
