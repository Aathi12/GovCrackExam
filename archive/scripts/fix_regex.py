import re

with open('test_progress_ui.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix the regex
text = re.sub(
    r"const match = html\.match\(.*?\);",
    r"const match = html.match(/<tr>\\s*<td>Syllogism<\\/td>\\s*<td>(.*?)<\\/td>\\s*<td>(.*?)<\\/td>\\s*<td>(.*?)<\\/td>/s);",
    text
)

with open('test_progress_ui.js', 'w', encoding='utf-8') as f:
    f.write(text)
