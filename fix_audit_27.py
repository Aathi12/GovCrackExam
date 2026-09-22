import re

with open('test_question_bank_audit.js', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('questions.length === 196', 'questions.length === 212')
text = text.replace('"Exactly 196 questions exist"', '"Exactly 212 questions exist"')

text = text.replace('["Blood Relations", "Coded Language", "Dictionary Order", "Letter-cluster Analogy / Series", "Mathematical Operations", "Syllogism", "Number/Figure Series"]',
                    '["Blood Relations", "Coded Language", "Dictionary Order", "Letter-cluster Analogy / Series", "Mathematical Operations", "Syllogism", "Number/Figure Series", "Classification (Odd One Out)"]')

text = text.replace('actualTopics.size === 7', 'actualTopics.size === 8')
text = text.replace('"All seven expected topics are strictly represented"', '"All eight expected topics are strictly represented"')

with open('test_question_bank_audit.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated test_question_bank_audit.js")
