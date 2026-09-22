with open('test_seo.py', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('"number-figure-series.html"', '"number-figure-series.html",\n    "classification-odd-one-out.html"')
text = text.replace('All seven pages have unique titles', 'All eight pages have unique titles')
text = text.replace('len(titles) == 7', 'len(titles) == 8')

with open('test_seo.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated test_seo.py")
