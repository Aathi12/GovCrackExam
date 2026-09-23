with open('classification-odd-one-out.html', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('Classification (Odd One Out)', 'Analogy (Word/Number)')
text = text.replace('classification-odd-one-out', 'analogy-word-number')
text = text.replace('Classification', 'Analogy (Word/Number)')

with open('analogy-word-number.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Created analogy-word-number.html")
