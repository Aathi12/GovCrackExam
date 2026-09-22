import re

with open('README.md', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace the specific lines
text = text.replace('128 independently verified questions', '221 independently verified questions')
text = text.replace('Weakness A- Frequency Weight', 'Weakness * Frequency Weight')
text = text.replace('"difficulty": 2,', '"difficulty": "Medium",')

if '- Mathematical Operations' in text and '- Number/Figure Series' not in text:
    text = text.replace('- Mathematical Operations', '- Mathematical Operations\n- Number/Figure Series\n- Classification (Odd One Out)\n- Analogy (Word/Number)')

with open('README.md', 'w', encoding='utf-8') as f:
    f.write(text)
