with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

target = '<a href="number-figure-series.html" class="secondary-btn" style="text-decoration: none; text-align: center;" title="Practice verified SSC CGL Number/Figure Series questions.">Number/Figure Series</a>'
replacement = target + '\n                    <a href="classification-odd-one-out.html" class="secondary-btn" style="text-decoration: none; text-align: center;" title="Practice verified SSC CGL Classification (Odd One Out) questions.">Classification (Odd One Out)</a>'

text = text.replace(target, replacement)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated index.html")
