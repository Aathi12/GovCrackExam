with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

target = '<a href="classification-odd-one-out.html" class="secondary-btn" style="text-decoration: none; text-align: center;" title="Practice verified SSC CGL Classification (Odd One Out) questions.">Classification (Odd One Out)</a>'
replacement = target + '\n                    <a href="analogy-word-number.html" class="secondary-btn" style="text-decoration: none; text-align: center;" title="Practice verified SSC CGL Analogy (Word/Number) questions.">Analogy (Word/Number)</a>'

text = text.replace(target, replacement)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated index.html")
