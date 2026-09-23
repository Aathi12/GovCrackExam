import json

with open('data/phase24_candidates.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

classification_candidates = []
for topic_data in data['topics']:
    if topic_data['topic'] == 'Classification (Odd One Out)':
        classification_candidates = topic_data['candidates']
        break

with open('classification_to_verify.json', 'w', encoding='utf-8') as f:
    json.dump(classification_candidates[:30], f, indent=2)

print(f"Extracted {len(classification_candidates[:30])} candidates for verification.")
