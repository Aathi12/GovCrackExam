import json

with open('data/questions.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

with open('verified_analogy.json', 'r', encoding='utf-8') as f:
    new_questions = json.load(f)

# Deduplicate using options as well
existing_signatures = set()
for q in questions:
    sig = q['question'].lower() + ''.join(q['options']).lower()
    existing_signatures.add(sig)

final_new = []
for nq in new_questions:
    sig = nq['question'].lower() + ''.join(nq['options']).lower()
    if sig not in existing_signatures:
        final_new.append(nq)
        existing_signatures.add(sig)
    else:
        print("Duplicate found and ignored:", nq['question'])

questions.extend(final_new)

with open('data/questions.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, indent=2)

print(f"Added {len(final_new)} questions to questions.json")
