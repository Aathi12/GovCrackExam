import json
with open('trace_results.json') as f: tr = json.load(f)
with open('new_51.json', encoding='utf-8') as f: qs = json.load(f)
q_map = {q['qid']: q for q in qs}

print("REJECTED:")
for r in tr:
    if r['status'] == 'REJECT':
        print(f"[{q_map[r['qid']]['subtopic']}] {q_map[r['qid']]['question'][:60]}")
        
print("\nREVIEW:")
for r in tr:
    if r['status'] == 'REVIEW':
        print(f"[{q_map[r['qid']]['subtopic']}] Missing: {r['reason']}")
