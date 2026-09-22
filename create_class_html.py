with open('number-figure-series.html', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('Number/Figure Series', 'Classification (Odd One Out)')
text = text.replace('number-figure-series', 'classification-odd-one-out')
text = text.replace('Number/Figure', 'Classification')

# specific SEO descriptions
text = text.replace('Practice SSC CGL Classification Series questions.', 'Practice SSC CGL Classification (Odd One Out) questions.')
text = text.replace('Master Classification Series', 'Master Classification (Odd One Out)')

with open('classification-odd-one-out.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Created classification-odd-one-out.html")
