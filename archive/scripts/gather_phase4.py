import json
import re
import os

transcript_path = r'C:\Users\acer\.gemini\antigravity\brain\540054af-2816-476f-af02-54cb15f6ad7a\.system_generated\logs\transcript_full.jsonl'

with open(transcript_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

all_new = []
for line in lines:
    if 'PLANNER_RESPONSE' not in line and 'USER_INPUT' not in line:
        try:
            data = json.loads(line)
            # Find messages from subagents
            if data.get('source') == 'MODEL' and 'subagent' in data.get('type', '').lower() or 'message' in data.get('content', '').lower():
                content = data.get('content', '')
                if '```json' in content:
                    blocks = re.findall(r'```json\n(.*?)\n```', content, re.DOTALL)
                    for block in blocks:
                        try:
                            qs = json.loads(block)
                            if isinstance(qs, list):
                                all_new.extend(qs)
                        except:
                            pass
        except:
            pass

print(f"Extracted {len(all_new)} questions from transcript.")

with open('new_questions_raw.json', 'w', encoding='utf-8') as f:
    json.dump(all_new, f, indent=2)
