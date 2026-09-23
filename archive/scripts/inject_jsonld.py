import os
import re

topics = {
    "blood-relations.html": "Blood Relations",
    "coded-language.html": "Coded Language",
    "dictionary-order.html": "Dictionary Order",
    "letter-cluster-analogy-series.html": "Letter-cluster Analogy / Series",
    "mathematical-operations.html": "Mathematical Operations",
    "syllogism.html": "Syllogism"
}

for filename, topic_name in topics.items():
    with open(filename, 'r', encoding='utf-8') as f:
        html = f.read()

    # Don't add twice
    if 'application/ld+json' in html:
        continue

    json_ld = f"""    <script type="application/ld+json">
    {{
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {{
          "@type": "ListItem",
          "position": 1,
          "name": "GovCrackExam",
          "item": "https://govcrackexam.online/"
        }},
        {{
          "@type": "ListItem",
          "position": 2,
          "name": "{topic_name}",
          "item": "https://govcrackexam.online/{filename}"
        }}
      ]
    }}
    </script>
</head>"""

    html = html.replace('</head>', json_ld)
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(html)
        
print("Injected JSON-LD BreadcrumbList into all topic pages.")
