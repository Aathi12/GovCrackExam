with open('test_seo.py', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('"classification-odd-one-out.html"', '"classification-odd-one-out.html",\n    "analogy-word-number.html"')
text = text.replace('All eight pages have unique titles', 'All nine pages have unique titles')
text = text.replace('len(titles) == 8', 'len(titles) == 9')

with open('test_seo.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated test_seo.py")
