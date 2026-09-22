with open('js/app.js', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace(
    "'Letter-cluster Analogy / Series', 'Mathematical Operations', 'Syllogism', 'Number/Figure Series', 'Classification (Odd One Out)'",
    "'Letter-cluster Analogy / Series', 'Mathematical Operations', 'Syllogism', 'Number/Figure Series', 'Classification (Odd One Out)', 'Analogy (Word/Number)'"
)

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated js/app.js")
