import re

with open('number-figure-series.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace titles and meta
html = html.replace('SSC CGL Syllogism Practice | GovCrackExam', 'SSC CGL Number Series Practice | GovCrackExam')
html = html.replace('Practice verified SSC CGL Syllogism questions with step-by-step explanations and targeted practice.',
                    'Practice verified SSC CGL Number/Figure Series questions with step-by-step explanations and targeted practice.')
html = html.replace('govcrackexam.online/syllogism.html', 'govcrackexam.online/number-figure-series.html')

# Replace BreadcrumbList
html = html.replace('"name": "Syllogism"', '"name": "Number/Figure Series"')
html = html.replace('"@id": "https://govcrackexam.online/syllogism.html"', '"@id": "https://govcrackexam.online/number-figure-series.html"')

# Replace content
html = html.replace('<h1>Syllogism</h1>', '<h1>Number/Figure Series</h1>')
html = html.replace('Practice 34 verified SSC CGL Syllogism questions.',
                    'Practice 17 verified SSC CGL Number/Figure Series questions.')

html = re.sub(r'<h2>How to Approach This Topic</h2>.*?<h2>Related Topics</h2>',
              '<h2>How to Approach This Topic</h2>\n        <p>Number and Figure series questions test your ability to recognize mathematical patterns, arithmetic progressions, multiplicative steps, or alternating logic. Pay close attention to the differences between consecutive terms and look for secondary difference patterns or relationships involving squares, cubes, and prime numbers.</p>\n        \n        <h2>Common Question Patterns</h2>\n        <ul>\n            <li><strong>Arithmetic & Geometric Series:</strong> Sequences increasing by fixed multiples or additions.</li>\n            <li><strong>Alternating Series:</strong> Two distinct patterns interleaved together.</li>\n            <li><strong>Squares & Cubes:</strong> Differences jumping by squares or cubes of integers.</li>\n            <li><strong>Prime Number Differences:</strong> Gaps determined by consecutive prime numbers.</li>\n        </ul>\n\n        <h2>Related Topics</h2>',
              html, flags=re.DOTALL)

# Update buttons
html = html.replace("startDirectPractice('Syllogism')", "startDirectPractice('Number/Figure Series')")
html = html.replace('Start Syllogism Practice', 'Start Number/Figure Series Practice')

# Update related topics links
html = html.replace('<li><a href="blood-relations.html">Blood Relations</a></li>', '<li><a href="blood-relations.html">Blood Relations</a></li>\n            <li><a href="syllogism.html">Syllogism</a></li>')
html = re.sub(r'<li><a href="syllogism\.html">.*?</a></li>', '', html, count=1) # Remove syllogism if it was there? No, syllogism was the file we copied so it didn't have syllogism in related.

# We copied from syllogism, so its related links were:
# Blood Relations, Coded Language, Dictionary Order, Letter-cluster Analogy, Mathematical Operations
# Just adding Syllogism is enough.

with open('number-figure-series.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Updated number-figure-series.html")
