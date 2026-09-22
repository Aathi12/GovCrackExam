import json
import re

with open('data/questions.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

with open(r'C:\Users\acer\OneDrive\SSC_CGL_ALL_PAPERS.txt', 'r', encoding='utf-8', errors='ignore') as f:
    corpus = f.read().lower()

def extract_alphanumeric(text):
    return re.sub(r'[^a-z0-9]', '', text.lower())

corpus_alnum = extract_alphanumeric(corpus)

audit_results = {
    'VERIFIED': [],
    'NEEDS_REVIEW': [],
    'REJECTED': []
}

for q in questions:
    q_alnum = extract_alphanumeric(q['question'])
    
    # Try finding in corpus
    # Take a generous substring of the question (say first 60 chars)
    search_str = q_alnum[:60] if len(q_alnum) >= 60 else q_alnum
    
    if search_str in corpus_alnum:
        # Full traceability needs paper match ideally, but if the question text exists, it's mostly verified.
        # Let's check options too.
        opts_alnum = [extract_alphanumeric(opt) for opt in q['options']]
        options_found = 0
        
        # We need to find the question block in the corpus
        idx = corpus_alnum.find(search_str)
        context = corpus_alnum[max(0, idx-50) : min(len(corpus_alnum), idx+1000)]
        
        for opt in opts_alnum:
            # Short options might spuriously match, but we do best effort
            if opt in context or opt in corpus_alnum:
                options_found += 1
                
        if options_found == 4:
            audit_results['VERIFIED'].append(q['qid'])
        else:
            audit_results['NEEDS_REVIEW'].append(q['qid'])
            print(f"Needs Review (missing options in context): {q['qid']}")
    else:
        audit_results['REJECTED'].append(q['qid'])
        print(f"Rejected (text not found): {q['qid']} - {search_str}")

print(f"\nVERIFIED: {len(audit_results['VERIFIED'])}")
print(f"NEEDS_REVIEW: {len(audit_results['NEEDS_REVIEW'])}")
print(f"REJECTED: {len(audit_results['REJECTED'])}")

with open('audit_results.json', 'w') as f:
    json.dump(audit_results, f, indent=2)
