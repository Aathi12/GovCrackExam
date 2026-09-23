with open('classification-odd-one-out.html', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('<title>SSC CGL Number Series Practice | GovCrackExam</title>', '<title>SSC CGL Classification Practice | GovCrackExam</title>')
text = text.replace('"name": "Number Series Practice"', '"name": "Classification Practice"')

with open('classification-odd-one-out.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Fixed title")
