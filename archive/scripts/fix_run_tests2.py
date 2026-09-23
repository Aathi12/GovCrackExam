with open('run_tests.js', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace("if ((!q.sourcePaper && !q.sourceReference) || !q.subtopic)", "if ((!q.sourcePaper && !q.sourceReference && !q.source) || !q.subtopic)")

text = text.replace("let normText = q.question.toLowerCase().replace(/[^a-z0-9]/g, '') + q.options.join('').toLowerCase().replace(/[^a-z0-9]/g, '');", 
                    "let normText = q.question.toLowerCase().replace(/[^a-z0-9]/g, '') + q.options.join(' ').toLowerCase().replace(/[^a-z0-9]/g, '');")

with open('run_tests.js', 'w', encoding='utf-8') as f:
    f.write(text)
