import re
import json

with open('SSC_CGL_ALL_PAPERS.txt', 'r', encoding='utf-8') as f:
    text = f.read()

files = text.split('--- FILE: ')
candidates = []
candidate_id = 1

for file_block in files[1:]:
    lines = file_block.split('\n')
    filename = lines[0].strip().replace(' ---', '')
    
    questions = re.split(r'\nQ\.\d+ ', file_block)
    for idx, q in enumerate(questions[1:]):
        q_low = q.lower()
        topic = None
        
        if 'faces of a dice' in q_low or 'opposite to the face' in q_low:
            topic = 'Dice'
        elif 'mirror is held' in q_low:
            topic = 'Mirror Image'
        elif 'piece of paper is folded' in q_low:
            topic = 'Paper Folding'
        elif 'hidden/embedded' in q_low:
            topic = 'Embedded Figures'
        elif 'relationship between the following classes' in q_low:
            topic = 'Venn Diagram'
            
        if topic:
            has_visual_ref = any(k in q_low for k in ['select the figure', 'which figure', 'given figure', 'shown in the', 'following figure', 'figure below', 'mirror', 'embedded', 'folded'])
            
            candidates.append({
                "id": f"v_{candidate_id}",
                "topic": topic,
                "source_filename": filename,
                "question_position": f"Q{idx+1}",
                "ocr_text": q[:500].strip(),
                "visual_content_referenced": has_visual_ref,
                "availability": "SOURCE REFERENCE FOUND BUT FILE UNAVAILABLE"
            })
            candidate_id += 1

print(f"Extracted {len(candidates)} visual candidates")
with open('data/phase32_visual_candidates.json', 'w', encoding='utf-8') as f:
    json.dump({"candidates": candidates}, f, indent=2)
