import json
import re

with open('data/questions_old.json', 'r', encoding='utf-8-sig') as f:
    old_qs = json.load(f)

with open('data/questions.json', 'r', encoding='utf-8') as f:
    new_qs = json.load(f)

old_ids = {q['qid'] for q in old_qs}

new_51 = [q for q in new_qs if q['qid'] not in old_ids]

with open('new_51.json', 'w', encoding='utf-8') as f:
    json.dump(new_51, f, indent=2)

print(f"Extracted {len(new_51)} new questions.")

# Now let's trace them in the corpus
with open(r'C:\Users\acer\OneDrive\SSC_CGL_ALL_PAPERS.txt', 'r', encoding='utf-8', errors='ignore') as f:
    corpus = f.read()

def normalize(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9]', '', text)
    return text
    
corpus_norm = normalize(corpus)

trace_results = []
for q in new_51:
    q_norm = normalize(q['question'])
    q_search = q_norm[:60]
    
    idx = corpus_norm.find(q_search)
    if idx == -1:
        trace_results.append({
            'qid': q['qid'],
            'status': 'REJECT',
            'reason': 'Question text not found in corpus'
        })
        continue
        
    context = corpus_norm[max(0, idx-50) : min(len(corpus_norm), idx+1000)]
    
    # check options
    missing_opts = []
    for opt in q['options']:
        opt_norm = normalize(opt)
        if opt_norm not in context:
            missing_opts.append(opt)
            
    if missing_opts:
        trace_results.append({
            'qid': q['qid'],
            'status': 'REVIEW',
            'reason': f"Missing options in corpus: {missing_opts}"
        })
    else:
        trace_results.append({
            'qid': q['qid'],
            'status': 'PASS',
            'reason': 'Found in corpus with all options'
        })

print("Trace Results:")
pass_count = sum(1 for r in trace_results if r['status'] == 'PASS')
review_count = sum(1 for r in trace_results if r['status'] == 'REVIEW')
reject_count = sum(1 for r in trace_results if r['status'] == 'REJECT')

print(f"PASS: {pass_count}, REVIEW: {review_count}, REJECT: {reject_count}")

with open('trace_results.json', 'w', encoding='utf-8') as f:
    json.dump(trace_results, f, indent=2)
