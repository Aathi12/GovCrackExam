import os

topics = [
    "blood-relations.html",
    "coded-language.html",
    "dictionary-order.html",
    "letter-cluster-analogy-series.html",
    "mathematical-operations.html",
    "syllogism.html"
]

target_link = '<a href="index.html" class="secondary-btn" style="text-decoration: none; text-align: center; display: block;">Start Diagnostic Quiz</a>'
new_link = '<a href="index.html" class="secondary-btn" style="text-decoration: none; text-align: center; display: block; background-color: var(--primary-color); color: white; border: 1px solid var(--primary-color);">Start Full Reasoning Practice</a>'

for t in topics:
    with open(t, 'r', encoding='utf-8') as f:
        html = f.read()
    
    if "Start Full Reasoning Practice" not in html:
        html = html.replace(target_link, target_link + '\n                    ' + new_link)
        with open(t, 'w', encoding='utf-8') as f:
            f.write(html)

print("Injected Full Practice links into topic pages.")
