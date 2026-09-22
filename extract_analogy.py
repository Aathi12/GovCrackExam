import json

with open('data/phase24_candidates.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

analogy_candidates = []
for topic_data in data['topics']:
    if topic_data['topic'] == 'Analogy (Word/Number)':
        analogy_candidates = topic_data['candidates']
        break

with open('analogy_to_verify.json', 'w', encoding='utf-8') as f:
    json.dump(analogy_candidates[:30], f, indent=2)

print(f"Extracted {len(analogy_candidates[:30])} Analogy candidates for verification.")
