import json
with open('data/questions.json', 'r', encoding='utf-8') as f:
    qs = json.load(f)

for i in range(0, len(qs), 30):
    batch = qs[i:i+30]
    out = []
    for q in batch:
        out.append({
            'qid': q['qid'],
            'subtopic': q['subtopic'],
            'question': q['question'],
            'options': q['options'],
            'correctOption': q['correctOption'],
            'explanation': q['explanation']
        })
    with open(f'explain_batch_{i//30}.json', 'w', encoding='utf-8') as f:
        json.dump(out, f, indent=2)

print(f"Created {len(range(0, len(qs), 30))} batches.")
