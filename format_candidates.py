import json

with open('candidates_phase4.json', 'r', encoding='utf-8') as f:
    candidates = json.load(f)

for topic, lst in candidates.items():
    formatted = []
    for c in lst:
        formatted.append({
            'sourcePaper': c['sourcePaper'],
            'raw_text': c['block']
        })
    with open(f"{topic.replace('/', '_').replace(' ', '_')}_candidates.json", 'w', encoding='utf-8') as f:
        json.dump(formatted, f, indent=2)
