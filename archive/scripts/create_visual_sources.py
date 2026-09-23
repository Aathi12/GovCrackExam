import os
import json

with open('data/phase32_visual_candidates.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

base_dir = 'data/phase32_visual_sources'
os.makedirs(base_dir, exist_ok=True)

for c in data['candidates']:
    c_dir = os.path.join(base_dir, c['id'])
    os.makedirs(c_dir, exist_ok=True)
    
    # Save metadata.json
    metadata = {
        "id": c['id'],
        "topic": c['topic'],
        "source_filename": c['source_filename'],
        "question_position": c['question_position'],
        "ocr_text": c['ocr_text'],
        "availability": c['availability']
    }
    with open(os.path.join(c_dir, 'metadata.json'), 'w', encoding='utf-8') as mf:
        json.dump(metadata, mf, indent=2)

print("Created phase32_visual_sources directories and metadata.json")
