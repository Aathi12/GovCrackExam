import re
import collections
import json

corpus_path = r'C:\Users\acer\OneDrive\SSC_CGL_ALL_PAPERS.txt'

with open(corpus_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Let's count some keywords to see what's present
keywords = {
    'Venn Diagram': ['venn diagram', 'classes are given', 'relationship between the following classes'],
    'Mirror Image': ['mirror image', 'mirror is placed', 'mirror is held'],
    'Paper Folding': ['piece of paper is folded', 'paper is folded and cut', 'folded and cut'],
    'Embedded Figures': ['embedded', 'hidden/embedded', 'embedded figure'],
    'Dice': ['different positions of the same dice', 'opposite to the face', 'faces of a dice'],
    'Number Series': ['series is given', 'next number in the series', 'replace the question mark'],
    'Word Analogy': ['related to the third word', 'related to the first word'],
    'Number Analogy': ['related to the third number', 'related to the first number'],
    'Odd One Out': ['odd one out', 'three of the following four', 'different from the other'],
    'Figure Series': ['next figure in the series', 'figure that will replace the question mark'],
    'Meaningful Order': ['logical and meaningful order', 'meaningful order'],
    'Statement & Conclusion': ['statements are given', 'conclusions are given', 'follows from the given statements'], # Could overlap with Syllogism
}

results = {}
for category, keys in keywords.items():
    count = 0
    for key in keys:
        count += len(re.findall(key, text.lower()))
    results[category] = count

print(json.dumps(results, indent=2))
