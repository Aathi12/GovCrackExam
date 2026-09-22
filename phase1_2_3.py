import json
import re

with open('data/questions.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

print(f"Total existing questions: {len(questions)}")

topics = {}
ids = set()
duplicates = 0
malformed = 0
missing_fields = 0

required_fields = ['qid', 'question', 'options', 'correctOption', 'sourceChosenOption', 'subtopic', 'difficulty', 'sourceYear', 'sourcePaper']

normalized_texts = {}

for q in questions:
    topics[q['subtopic']] = topics.get(q['subtopic'], 0) + 1
    
    if q['qid'] in ids:
        print(f"Duplicate ID found: {q['qid']}")
        duplicates += 1
    ids.add(q['qid'])
    
    for f in required_fields:
        if f not in q:
            print(f"Missing field {f} in question {q['qid']}")
            missing_fields += 1
            
    if not isinstance(q.get('options'), list) or len(q.get('options', [])) != 4:
        print(f"Malformed options in {q['qid']}")
        malformed += 1
        
    if q.get('correctOption') not in [1, 2, 3, 4]:
        print(f"Invalid correctOption in {q['qid']}")
        malformed += 1
        
    norm_text = re.sub(r'\s+', ' ', q['question']).strip().lower()
    if norm_text in normalized_texts:
        print(f"Duplicate text found for {q['qid']} and {normalized_texts[norm_text]}")
        duplicates += 1
    normalized_texts[norm_text] = q['qid']

print("\nQuestions per topic:")
for t, c in topics.items():
    print(f"- {t}: {c}")

print(f"\nDuplicates: {duplicates}")
print(f"Missing fields: {missing_fields}")
print(f"Malformed: {malformed}")

# Load corpus to check source traceability
with open(r'C:\Users\acer\OneDrive\SSC_CGL_ALL_PAPERS.txt', 'r', encoding='utf-8', errors='ignore') as f:
    corpus = f.read().lower()

untraceable = 0
for q in questions:
    # Try to find a snippet of the question in the corpus
    # Take first 40 chars to avoid OCR minor variations
    snippet = re.sub(r'\s+', ' ', q['question']).strip().lower()[:40]
    if snippet not in corpus:
        # try without punctuation
        snippet_nopunct = re.sub(r'[^\w\s]', '', snippet)
        corpus_nopunct = re.sub(r'[^\w\s]', '', corpus)
        if snippet_nopunct not in corpus_nopunct:
            print(f"Untraceable: {q['qid']} - {snippet}")
            untraceable += 1

print(f"\nUntraceable questions: {untraceable}")
