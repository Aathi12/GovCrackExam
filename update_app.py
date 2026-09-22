import re

with open('js/app.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace ['Blood Relations', 'Coded Language', 'Dictionary Order', 'Letter-cluster Analogy / Series', 'Mathematical Operations', 'Syllogism']
# Notice the line breaks. I will just do a regex replace for the array content.

text = text.replace(
    "'Letter-cluster Analogy / Series', 'Mathematical Operations', 'Syllogism'",
    "'Letter-cluster Analogy / Series', 'Mathematical Operations', 'Syllogism', 'Number/Figure Series'"
)

text = text.replace(
    '\"Syllogism\"',
    '\"Syllogism\",\n        \"Number/Figure Series\"'
)

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated js/app.js")
