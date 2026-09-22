with open('test_full_practice.js', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('"Syllogism", "Number/Figure Series"]);', '"Syllogism", "Number/Figure Series", "Classification (Odd One Out)"]);')
text = text.replace('"4. Only seven valid topics occur"', '"4. Only eight valid topics occur"')

with open('test_full_practice.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated test_full_practice.js")
