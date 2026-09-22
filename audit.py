import glob
import re

topics = [
    "Coded Language",
    "Letter-cluster Analogy / Series",
    "Syllogism",
    "Blood Relations",
    "Dictionary Order",
    "Mathematical Operations",
    "Number/Figure Series",
    "Classification (Odd One Out)",
    "Analogy (Word/Number)"
]

pages = glob.glob('*.html')

audit_content = "# Phase 49 SEO Content Audit\n\n## Pages\n"
for page in pages:
    if page == '404.html': continue
    with open(page, 'r', encoding='utf-8') as f:
        html = f.read()
    
    title_match = re.search(r'<title>(.*?)</title>', html)
    title = title_match.group(1) if title_match else "Missing"
    
    desc_match = re.search(r'<meta name="description" content="(.*?)">', html)
    desc = "Present" if desc_match else "Missing"
    
    canon_match = re.search(r'<link rel="canonical" href="(.*?)">', html)
    canon = canon_match.group(1) if canon_match else "Missing"
    
    og_title = "Present" if 'property="og:title"' in html else "Missing"
    og_desc = "Present" if 'property="og:description"' in html else "Missing"
    og_url = "Present" if 'property="og:url"' in html else "Missing"
    
    audit_content += f"### {page}\n"
    audit_content += f"- Title: {title}\n"
    audit_content += f"- Description: {desc}\n"
    audit_content += f"- Canonical: {canon}\n"
    audit_content += f"- Open Graph: Title: {og_title}, Desc: {og_desc}, URL: {og_url}\n\n"

audit_content += "## Topics in Production Data\n"
for t in topics:
    audit_content += f"- {t}\n"

with open('PHASE49_SEO_CONTENT_AUDIT.md', 'w', encoding='utf-8') as f:
    f.write(audit_content)
