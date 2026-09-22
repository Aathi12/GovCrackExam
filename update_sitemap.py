with open('sitemap.xml', 'r', encoding='utf-8') as f:
    text = f.read()

new_node = """  <url>
    <loc>https://govcrackexam.online/number-figure-series.html</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>"""

text = text.replace('</urlset>', new_node)

with open('sitemap.xml', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated sitemap.xml")
