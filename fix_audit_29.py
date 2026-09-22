import re

with open('test_question_bank_audit.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Current length is 212. New length is 212 + 16 = 228
text = text.replace('questions.length === 212', 'questions.length === 228')
text = text.replace('"Exactly 212 questions exist"', '"Exactly 228 questions exist"')

text = text.replace('["Blood Relations", "Coded Language", "Dictionary Order", "Letter-cluster Analogy / Series", "Mathematical Operations", "Syllogism", "Number/Figure Series", "Classification (Odd One Out)"]',
                    '["Blood Relations", "Coded Language", "Dictionary Order", "Letter-cluster Analogy / Series", "Mathematical Operations", "Syllogism", "Number/Figure Series", "Classification (Odd One Out)", "Analogy (Word/Number)"]')

text = text.replace('actualTopics.size === 8', 'actualTopics.size === 9')
text = text.replace('"All eight expected topics are strictly represented"', '"All nine expected topics are strictly represented"')

with open('test_question_bank_audit.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated test_question_bank_audit.js")
