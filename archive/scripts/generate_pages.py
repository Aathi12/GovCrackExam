import json

topics = [
    {
        "id": "blood-relations",
        "title": "Blood Relations",
        "intro": "The Blood Relations section tests your ability to interpret family relationship chains. In SSC CGL, you will often need to identify the exact relationship between two individuals based on a series of connected statements or coded symbols.",
        "method": "To approach this topic effectively, draw a simple family tree. Use squares for males, circles for females, horizontal lines for siblings, and vertical lines for different generations. Translate each statement into a visual node one by one.",
        "patterns": "Common patterns include identifying maternal or paternal relationships from a descriptive paragraph, and decoding relationships where symbols (like +, -, *, /) represent specific family ties (e.g., A + B means A is the brother of B).",
        "file": "blood-relations.html"
    },
    {
        "id": "coded-language",
        "title": "Coded Language",
        "intro": "Coded Language questions test your pattern recognition skills. You are presented with words or numbers that have been transformed according to a specific hidden rule, and you must apply that same rule to a new word.",
        "method": "Always write down the alphabetical position of each letter (A=1, B=2... Z=26). Compare the original word with its coded version to find numerical shifts, reverse letter substitutions, or vowel/consonant specific rules. Once you find the exact logic, apply it consistently to the target word.",
        "patterns": "Common patterns include direct letter substitutions, shifting positions by a fixed number (e.g., +3 or -2), using reverse alphabetical positions, and replacing vowels while keeping consonants the same.",
        "file": "coded-language.html"
    },
    {
        "id": "dictionary-order",
        "title": "Dictionary Order",
        "intro": "Dictionary Order tests your ability to quickly and accurately sort words exactly as they would appear in a standard English dictionary. It requires strict attention to alphabetical sequence.",
        "method": "Compare the words letter by letter from left to right. When the first few letters are identical (common prefixes), look at the first differing character to determine the correct order. Do not skip letters or rush the comparison.",
        "patterns": "Questions typically ask you to arrange 5 or 6 words in alphabetical order and either identify the correct overall sequence from the options, or pinpoint which word appears at a specific position (like the third or fifth word).",
        "file": "dictionary-order.html"
    },
    {
        "id": "letter-cluster-analogy-series",
        "title": "Letter-cluster Analogy / Series",
        "intro": "Letter-cluster Analogy and Series questions require you to identify the logical relationship between groups of letters. You must determine how one letter cluster transforms into another and apply that logic forward.",
        "method": "Write the numerical alphabet position above each letter. Analyze the gap or shift between corresponding letters in the clusters (e.g., first letter to first letter, second to second). Determine the mathematical transformation (+2, -3, etc.) and apply it to find the missing cluster.",
        "patterns": "Common patterns involve fixed shifts (+2, +3, +4), alternating shifts, reverse alphabetical pairs, and sequences that follow a steady progression across multiple letter clusters.",
        "file": "letter-cluster-analogy-series.html"
    },
    {
        "id": "mathematical-operations",
        "title": "Mathematical Operations",
        "intro": "Mathematical Operations questions test your ability to evaluate arithmetic expressions when standard symbols have been substituted or interchanged. This requires careful calculation and strict adherence to BODMAS rules.",
        "method": "First, completely rewrite the given expression using the new substituted symbols or interchanged numbers. Do not try to solve it mentally while swapping. Once rewritten, strictly apply the BODMAS rule (Brackets, Orders, Division, Multiplication, Addition, Subtraction) to calculate the final result.",
        "patterns": "Common patterns include interchanging two mathematical signs (like + and -), interchanging two specific numbers, or replacing arbitrary symbols (like #, @) with actual arithmetic operators.",
        "file": "mathematical-operations.html"
    },
    {
        "id": "syllogism",
        "title": "Syllogism",
        "intro": "Syllogism questions present you with two or more logical statements and ask you to determine which conclusions definitively follow. This tests pure logical deduction without relying on real-world facts.",
        "method": "Draw Venn diagrams to represent the statements. Use overlapping circles for 'Some', a circle entirely inside another for 'All', and completely separate circles for 'No'. Evaluate each conclusion based strictly on what must be true according to your diagram, avoiding outside assumptions.",
        "patterns": "Common patterns involve evaluating whether 'some' or 'all' relationships logically deduce another relationship, identifying when a conclusion is only a possibility rather than a certainty, and handling negative 'no' statements.",
        "file": "syllogism.html"
    }
]

template = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SSC CGL {title} Practice | GovCrackExam</title>
    <meta name="description" content="Practice SSC CGL {title} reasoning questions. Learn the approach, common patterns, and take a verified diagnostic quiz on GovCrackExam.">
    <link rel="canonical" href="https://govcrackexam.online/{file}">
    <meta property="og:title" content="SSC CGL {title} Practice | GovCrackExam">
    <meta property="og:description" content="Practice SSC CGL {title} reasoning questions. Learn the approach, common patterns, and take a verified diagnostic quiz on GovCrackExam.">
    <meta property="og:url" content="https://govcrackexam.online/{file}">
    <meta property="og:type" content="article">
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="SSC CGL {title} Practice | GovCrackExam">
    <meta name="twitter:description" content="Practice SSC CGL {title} reasoning questions. Learn the approach, common patterns, and take a verified diagnostic quiz on GovCrackExam.">
    <link rel="stylesheet" href="css/styles.css">
    <style>
        .topic-content {{
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: var(--bg-card);
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }}
        .topic-content h2 {{
            margin-top: 30px;
            margin-bottom: 15px;
            color: var(--primary-color);
        }}
        .topic-content p {{
            margin-bottom: 15px;
            line-height: 1.6;
        }}
        .related-topics {{
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid var(--border-color);
        }}
        .related-topics ul {{
            list-style: none;
            padding: 0;
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }}
        .related-topics li a {{
            display: inline-block;
            padding: 8px 12px;
            background: var(--secondary-color);
            border-radius: 4px;
            text-decoration: none;
            color: var(--text-main);
            font-size: 0.9rem;
        }}
        .related-topics li a:hover {{
            background: var(--border-color);
        }}
    </style>
</head>
<body>
    <header>
        <div class="container">
            <div style="font-size: 1.5rem; font-weight: bold; margin-bottom: 5px;">GovCrackExam</div>
            <p>Weak-Topic Drill - Pilot (Verified Data Only)</p>
        </div>
    </header>

    <main class="container">
        <section class="screen active">
            <div class="topic-content">
                <h1>SSC CGL {title} Reasoning Practice</h1>
                
                <p>{intro}</p>
                
                <h2>How to Approach This Topic</h2>
                <p>{method}</p>
                
                <h2>Common Question Patterns</h2>
                <p>{patterns}</p>
                
                <h2>Practice with GovCrackExam</h2>
                <p>The GovCrackExam platform contains verified SSC CGL questions for <strong>{title}</strong>. You can take a full diagnostic quiz to identify your weak areas, and then practice specifically with targeted drills.</p>
                
                <div class="info-box" style="margin: 25px 0;">
                    <strong>Disclaimer:</strong>
                    <p style="margin-bottom: 0;">The questions in the current pilot bank are based on a verified subset of the supplied SSC CGL corpus. Frequency weights used for prioritization are corpus-derived pilot estimates, not universal SSC CGL statistics.</p>
                </div>
                
                <div class="actions" style="margin-top: 30px; display: flex; flex-direction: column; gap: 15px;">
                    <a href="index.html" class="primary-btn" style="text-decoration: none; text-align: center; display: block;">Start Diagnostic Quiz</a>
                    <a href="index.html" class="secondary-btn" style="text-decoration: none; text-align: center; display: block;">Back to GovCrackExam Home</a>
                </div>
                
                <div class="related-topics">
                    <h3>Related Topics</h3>
                    <ul>
                        {related_links}
                    </ul>
                </div>
            </div>
        </section>
    </main>

    <footer class="footer">
        <div class="container">
            <p>GovCrackExam - Free Client-Side Tool. No Login Required.</p>
            <p style="margin-top: 10px; font-size: 0.9rem;"><a href="https://github.com/Aathi12/GovCrackExam/issues" target="_blank" rel="noopener noreferrer" style="color: #cbd5e1; text-decoration: underline;">Found a question issue? Send feedback</a></p>
        </div>
    </footer>
</body>
</html>
"""

for t in topics:
    related = ""
    for r in topics:
        if r['id'] != t['id']:
            related += f'<li><a href="{r["file"]}">Practice SSC CGL {r["title"]}</a></li>\n                        '
    
    html = template.format(
        title=t['title'],
        intro=t['intro'],
        method=t['method'],
        patterns=t['patterns'],
        file=t['file'],
        related_links=related.strip()
    )
    with open(t['file'], 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Created {t['file']}")
