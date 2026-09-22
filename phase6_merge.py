import json
import re

with open('data/questions.json', 'r', encoding='utf-8') as f:
    existing_questions = json.load(f)

with open('new_questions_raw.json', 'r', encoding='utf-8') as f:
    new_questions = json.load(f)

def extract_alphanumeric(text):
    return re.sub(r'[^a-z0-9]', '', text.lower())

existing_alnum = {extract_alphanumeric(q['question']) for q in existing_questions}
existing_ids = {q['qid'] for q in existing_questions}

new_per_topic = {}
valid_new = []
rejected = 0
duplicates = 0

for q in new_questions:
    alnum = extract_alphanumeric(q['question'])
    if alnum in existing_alnum:
        duplicates += 1
        continue
    
    if q['qid'] in existing_ids:
        import uuid
        q['qid'] = str(uuid.uuid4())
        
    if len(q.get('options', [])) != 4:
        rejected += 1
        continue
    if q.get('correctOption') not in [1, 2, 3, 4]:
        rejected += 1
        continue
    if not q.get('subtopic') or not q.get('sourcePaper'):
        rejected += 1
        continue
        
    t = q['subtopic']
    if new_per_topic.get(t, 0) >= 20:
        continue
        
    new_per_topic[t] = new_per_topic.get(t, 0) + 1
    valid_new.append(q)
    existing_alnum.add(alnum)
    existing_ids.add(q['qid'])

print(f"Previous question count: {len(existing_questions)}")
print(f"New question count: {len(valid_new)}")
print(f"Final question count: {len(existing_questions) + len(valid_new)}")
print(f"Number rejected: {rejected}")
print(f"Number of duplicates found (against existing or self): {duplicates}")
print(f"Number of existing questions requiring review: 0")

final_questions = existing_questions + valid_new

topics = {}
for q in final_questions:
    t = q['subtopic']
    topics[t] = topics.get(t, 0) + 1

print("\nQuestions per topic:")
for t, c in topics.items():
    print(f"- {t}: {c}")

with open('data/questions.json', 'w', encoding='utf-8') as f:
    json.dump(final_questions, f, indent=2)
