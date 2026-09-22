with open('sitemap.xml', 'r', encoding='utf-8') as f:
    text = f.read()

target = '<loc>https://govcrackexam.online/classification-odd-one-out.html</loc>'
replacement = target + '\n  </url>\n  <url>\n    <loc>https://govcrackexam.online/analogy-word-number.html</loc>'

text = text.replace(target, replacement)

with open('sitemap.xml', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated sitemap.xml")
