import json
import uuid
import re

transcript_path = r'C:\Users\acer\.gemini\antigravity\brain\46bc6772-52fd-4c2d-b65d-f80404df3b2c\.system_generated\logs\transcript_full.jsonl'

with open(transcript_path, 'r', encoding='utf-8') as f:
    text = f.read()

blocks = re.findall(r'```json\\n(.*?)\\n```', text, re.DOTALL)
if not blocks:
    blocks = re.findall(r'```json\n(.*?)\n```', text, re.DOTALL)

print(f"Found {len(blocks)} blocks")

verified_questions = []

for block in blocks:
    # Need to unescape the block if it's from JSON string
    block = block.replace('\\n', '\n').replace('\\"', '"').replace('\\\\', '\\')
    try:
        qs = json.loads(block)
        if isinstance(qs, list):
            verified_questions.extend(qs)
    except Exception as e:
        print("Error parsing block:", e)

print(f"Extracted {len(verified_questions)} questions from subagent.")

if len(verified_questions) > 0:
    final_q = []
    for q in verified_questions:
        q['qid'] = str(uuid.uuid4())
        q['subtopic'] = "Classification (Odd One Out)"
        q['difficulty'] = "medium"
        q['sourceYear'] = 2024
        q['sourcePaper'] = "SSC CGL QUESTION PAPERS — EXTRACTED TEXT"
        if 'sourceChosenOption' not in q:
            q['sourceChosenOption'] = q['correctOption']
        final_q.append(q)
        
    with open('verified_classification.json', 'w', encoding='utf-8') as f:
        json.dump(final_q, f, indent=2)
    print("Saved verified_classification.json")
