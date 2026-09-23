with open('test_full_practice.js', 'r', encoding='utf-8') as f:
    text = f.read()
text = text.replace('"Syllogism"]);', '"Syllogism", "Number/Figure Series"]);')
with open('test_full_practice.js', 'w', encoding='utf-8') as f:
    f.write(text)
