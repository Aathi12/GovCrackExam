import re
import json

corpus_path = r'C:\Users\acer\OneDrive\SSC_CGL_ALL_PAPERS.txt'

with open(corpus_path, 'r', encoding='utf-8') as f:
    text = f.read()

papers = re.split(r'(SSC CGL QUESTION PAPER.*?)\n', text)
questions_by_topic = {
    'Dictionary Order': [],
    'Syllogism': [],
    'Blood Relations': [],
    'Mathematical Operations': [],
    'Coded Language': [],
    'Letter-cluster Analogy / Series': [],
    'Number/Figure Series': []
}

current_paper = "Unknown"
for i in range(1, len(papers), 2):
    current_paper = papers[i].strip()
    content = papers[i+1]
    
    q_blocks = re.split(r'\nQ\.\d+', content)
    
    for block in q_blocks[1:]:
        q_lower = block.lower()
        topic = None
        
        if 'dictionary order' in q_lower:
            topic = 'Dictionary Order'
        elif 'statements are given' in q_lower or 'conclusions are given' in q_lower:
            topic = 'Syllogism'
        elif 'father of' in q_lower or 'mother of' in q_lower or 'brother of' in q_lower or 'sister of' in q_lower or 'husband of' in q_lower or 'wife of' in q_lower:
            topic = 'Blood Relations'
        elif 'interchange' in q_lower and ('signs' in q_lower or 'numbers' in q_lower):
            topic = 'Mathematical Operations'
        elif 'mathematical signs' in q_lower or 'meaning of' in q_lower:
            topic = 'Mathematical Operations'
        elif 'code language' in q_lower or 'coded as' in q_lower or 'written as' in q_lower:
            topic = 'Coded Language'
        elif 'replace the question mark' in q_lower and 'letter-cluster' in q_lower:
            topic = 'Letter-cluster Analogy / Series'
        elif 'related to the third letter-cluster' in q_lower:
            topic = 'Letter-cluster Analogy / Series'
        elif 'replace the question mark' in q_lower and 'letter-cluster' not in q_lower:
            topic = 'Number/Figure Series'
            
        if topic:
            questions_by_topic[topic].append({
                'q': block,
                'paper': current_paper
            })

for topic, qs in questions_by_topic.items():
    print(f"{topic}: {len(qs)}")
