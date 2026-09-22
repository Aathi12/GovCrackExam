import re

with open('test_progress_ui.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "const match = html.match(" in line:
        lines[i] = "    const match = html.match(/<tr>\\\\s*<td>Syllogism<\\\\/td>\\\\s*<td>(.*?)<\\\\/td>\\\\s*<td>(.*?)<\\\\/td>\\\\s*<td>(.*?)<\\\\/td>/s);\n"

with open('test_progress_ui.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
