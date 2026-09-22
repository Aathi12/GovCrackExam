with open('js/app.js', 'r', encoding='utf-8') as f:
    js = f.read()

import re

# We will remove all occurrences of the block.
# Since spacing might be slightly off, we use a regex.
pattern = re.compile(r'    // Topic x Difficulty Summary\s+const txD = \{\};\s+topics\.forEach\(t => \{ txD\[t\] = \{ Easy: \{c:0, a:0\}, Medium: \{c:0, a:0\}, Hard: \{c:0, a:0\} \}; \}\);\s+function addTxD\(records\) \{.*?(?=progressContent\.innerHTML|</script>|    \}|    // Topic x Difficulty Summary|$)', re.DOTALL)

# Wait, let's just find the exact text we know is repeated.
block_start = "    // Topic x Difficulty Summary\n    const txD = {};"
parts = js.split(block_start)

if len(parts) > 1:
    print(f"Found {len(parts)-1} occurrences")
    # The first part is everything before the first occurrence.
    # The last part has the rest of the code. We need to extract the block text from one of them.
    # Actually, let's just use regex to remove everything from `// Topic x Difficulty Summary` up to `html += '</tbody></table></div>';\n    }`
    
    # Simpler:
    regex = r"    // Topic x Difficulty Summary\n    const txD = \{\};\n.*?html \+= '</tbody></table></div>';\n    \}"
    matches = re.findall(regex, js, re.DOTALL)
    print(f"Regex found {len(matches)} matches")
    
    if matches:
        clean_js = re.sub(regex, "", js, flags=re.DOTALL)
        # Re-insert one copy before progressContent.innerHTML
        final_js = clean_js.replace("progressContent.innerHTML = html;", matches[0] + "\n\n    progressContent.innerHTML = html;")
        with open('js/app.js', 'w', encoding='utf-8') as out:
            out.write(final_js)
        print("Fixed app.js")
