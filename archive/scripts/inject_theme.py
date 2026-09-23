import os

html_files = [
    "index.html",
    "404.html",
    "blood-relations.html",
    "coded-language.html",
    "dictionary-order.html",
    "letter-cluster-analogy-series.html",
    "mathematical-operations.html",
    "syllogism.html"
]

for filename in html_files:
    if not os.path.exists(filename):
        continue
    with open(filename, 'r', encoding='utf-8') as f:
        html = f.read()

    if 'name="theme-color"' not in html:
        html = html.replace('<meta name="viewport" content="width=device-width, initial-scale=1.0">',
                            '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <meta name="theme-color" content="#0f4c81">')
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(html)

print("Injected theme-color into all HTML pages.")
