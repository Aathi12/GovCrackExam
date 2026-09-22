with open('test_seo.py', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('"syllogism.html"', '"syllogism.html",\n    "number-figure-series.html"')

text = text.replace('Homepage links to syllogism.html"', 'Homepage links to syllogism.html")\n    assert_true("number-figure-series.html" in home_html, "Homepage links to number-figure-series.html"')

text = text.replace('Sitemap contains syllogism.html"', 'Sitemap contains syllogism.html")\n    assert_true("number-figure-series.html" in sitemap, "Sitemap contains number-figure-series.html"')

with open('test_seo.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated test_seo.py")
