import json
import re

# Load existing questions to avoid duplicates
with open('data/questions.json', 'r', encoding='utf-8') as f:
    existing_questions = json.load(f)

def extract_alphanumeric(text):
    return re.sub(r'[^a-z0-9]', '', text.lower())

existing_alnum = {extract_alphanumeric(q['question']) for q in existing_questions}

with open(r'C:\Users\acer\OneDrive\SSC_CGL_ALL_PAPERS.txt', 'r', encoding='utf-8', errors='ignore') as f:
    corpus = f.read()

blocks = re.split(r'\nQ\.\d+\s+', corpus)

topics = {
    'Coded Language': ['code language', 'coded as', 'written as'],
    'Letter-cluster Analogy / Series': ['related to the third letter-cluster', 'related to the third term', 'letter-cluster series', 'replace the question mark in the following letter-cluster'],
    'Syllogism': ['statements:', 'conclusions:'],
    'Blood Relations': ['is the brother of', 'is the father of', 'is the mother of', 'is the sister of', 'husband of', 'wife of', 'daughter of', 'son of', 'pointing to'],
    'Dictionary Order': ['english dictionary', 'dictionary order'],
    'Mathematical Operations': ['interchanged to make the given equation correct', 'signs should be interchanged', 'interchange the given two signs']
}

candidates = {t: [] for t in topics.keys()}

current_paper = "Unknown"
for block in blocks:
    if not block.strip(): continue
        
    file_match = re.search(r'---\s*FILE:\s*(.*?)\s*---', block)
    if file_match:
        current_paper = file_match.group(1).strip()

    ans_split = block.split('\nAns\n')
    question_text = ans_split[0] if len(ans_split) > 0 else block
    norm_lower = question_text.lower()
    alnum = extract_alphanumeric(question_text)
    
    if len(alnum) < 15: continue
    
    # Check if already exists
    if alnum in existing_alnum:
        continue

    # Check for options 1. 2. 3. 4.
    if '1.' not in block or '2.' not in block or '3.' not in block or '4.' not in block:
        continue

    # Classify
    matched_topic = None
    if 'dictionary' in norm_lower:
        matched_topic = 'Dictionary Order'
    elif 'statements:' in norm_lower and 'conclusions:' in norm_lower:
        matched_topic = 'Syllogism'
    elif 'code language' in norm_lower or 'coded as' in norm_lower or 'written as' in norm_lower:
        matched_topic = 'Coded Language'
    elif 'signs should be interchanged' in norm_lower or 'interchanged to make the given equation correct' in norm_lower or 'interchange the given two signs' in norm_lower or ('means' in norm_lower and ('+' in norm_lower or '-' in norm_lower or '*' in norm_lower or '÷' in norm_lower) and 'equation' in norm_lower):
        matched_topic = 'Mathematical Operations'
    elif 'letter-cluster' in norm_lower:
        matched_topic = 'Letter-cluster Analogy / Series'
    elif any(x in norm_lower for x in ['is the brother of', 'is the father of', 'is the mother of', 'is the sister of', 'is the wife of', 'is the husband of', 'daughter of my', 'son of my', 'pointing to a']):
        matched_topic = 'Blood Relations'
        
    if matched_topic:
        if len(candidates[matched_topic]) < 35: # Extract 35 to guarantee we get 15-20 verified
            candidates[matched_topic].append({
                'sourcePaper': current_paper,
                'block': block
            })

for t, lst in candidates.items():
    print(f"Extracted {len(lst)} candidates for {t}")

with open('candidates_phase4.json', 'w', encoding='utf-8') as f:
    json.dump(candidates, f, indent=2)
