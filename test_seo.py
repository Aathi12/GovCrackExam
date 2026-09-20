import os
import re

topics = [
    "blood-relations.html",
    "coded-language.html",
    "dictionary-order.html",
    "letter-cluster-analogy-series.html",
    "mathematical-operations.html",
    "syllogism.html"
]

all_passed = True

def assert_cond(cond, msg):
    global all_passed
    if not cond:
        print(f"FAIL: {msg}")
        all_passed = False
    else:
        print(f"PASS: {msg}")

# 1. All six topic pages exist
for t in topics:
    assert_cond(os.path.exists(t), f"{t} exists")

# 2-8. Check HTML content
titles = set()
for t in topics:
    with open(t, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # 2. Unique titles
    title_match = re.search(r'<title>(.*?)</title>', html)
    assert_cond(bool(title_match), f"{t} has title")
    if title_match:
        titles.add(title_match.group(1))
    
    # 3. Meta descriptions
    assert_cond('<meta name="description"' in html, f"{t} has meta description")
    
    # 4 & 5. Canonical URLs
    canonical_match = re.search(r'<link rel="canonical" href="(.*?)">', html)
    assert_cond(bool(canonical_match), f"{t} has canonical URL")
    if canonical_match:
        assert_cond('https://govcrackexam.online/' in canonical_match.group(1), f"{t} canonical URL uses govcrackexam.online")
    
    # 6. Exactly one H1
    h1_count = len(re.findall(r'<h1.*?>.*?</h1>', html))
    assert_cond(h1_count == 1, f"{t} has exactly one H1 (found {h1_count})")
    
    # 7 & 8. Link back to homepage / diagnostic
    assert_cond('href="index.html"' in html, f"{t} links back to homepage/diagnostic")

assert_cond(len(titles) == 6, "All six pages have unique titles")

# 9. Homepage links to all six topic pages
with open('index.html', 'r', encoding='utf-8') as f:
    index_html = f.read()
    for t in topics:
        assert_cond(f'href="{t}"' in index_html, f"Homepage links to {t}")

# 10 & 11. Sitemap checks
with open('sitemap.xml', 'r', encoding='utf-8') as f:
    sitemap = f.read()
    assert_cond('https://govcrackexam.online/</loc>' in sitemap, "Sitemap contains homepage")
    for t in topics:
        assert_cond(f'https://govcrackexam.online/{t}</loc>' in sitemap, f"Sitemap contains {t}")

# 12. Robots.txt
with open('robots.txt', 'r', encoding='utf-8') as f:
    robots = f.read()
    assert_cond('Sitemap: https://govcrackexam.online/sitemap.xml' in robots, "robots.txt references production sitemap")

if all_passed:
    print("All SEO tests passed.")
else:
    exit(1)
