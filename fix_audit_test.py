import re

with open('test_question_bank_audit.js', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('questions.length === 179', 'questions.length === 196')
text = text.replace('"Exactly 179 questions exist"', '"Exactly 196 questions exist"')

text = text.replace('["Blood Relations", "Coded Language", "Dictionary Order", "Letter-cluster Analogy / Series", "Mathematical Operations", "Syllogism"]',
                    '["Blood Relations", "Coded Language", "Dictionary Order", "Letter-cluster Analogy / Series", "Mathematical Operations", "Syllogism", "Number/Figure Series"]')

text = text.replace('actualTopics.size === 6', 'actualTopics.size === 7')
text = text.replace('"All six expected topics are strictly represented"', '"All seven expected topics are strictly represented"')

with open('test_question_bank_audit.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated test_question_bank_audit.js")
