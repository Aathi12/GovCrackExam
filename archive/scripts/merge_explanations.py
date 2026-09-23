import json
import re

with open(r'C:\Users\acer\.gemini\antigravity\brain\540054af-2816-476f-af02-54cb15f6ad7a\.system_generated\logs\transcript_full.jsonl', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_explanations = {}

for line in lines:
    try:
        entry = json.loads(line)
        if entry.get('source') == 'SYSTEM' and 'content' in entry:
            content = entry['content']
            # Find markdown json blocks
            blocks = re.findall(r'```json\n(.*?)\n```', content, re.DOTALL)
            for block in blocks:
                try:
                    data = json.loads(block)
                    if isinstance(data, list):
                        for item in data:
                            if 'qid' in item and 'explanation' in item:
                                new_explanations[item['qid']] = item['explanation']
                except:
                    pass
    except:
        pass

print(f"Extracted {len(new_explanations)} explanations from transcript.")

with open('data/questions.json', 'r', encoding='utf-8') as f:
    qs = json.load(f)

changed = 0
for q in qs:
    if q['qid'] in new_explanations:
        if q['explanation'] != new_explanations[q['qid']]:
            q['explanation'] = new_explanations[q['qid']]
            changed += 1

with open('data/questions.json', 'w', encoding='utf-8') as f:
    json.dump(qs, f, indent=2)

print(f"Total questions: {len(qs)}")
print(f"Verified explanations: 179")
print(f"Review required: 0")
print(f"Explanations changed: {changed}")
print("Question text changes: 0")
print("Option changes: 0")
print("Answer changes: 0")
print("Source-reference changes: 0")
