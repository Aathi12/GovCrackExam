import re
import json

with open('SSC_CGL_ALL_PAPERS.txt', 'r', encoding='utf-8') as f:
    text = f.read()

files = text.split('--- FILE: ')
candidates = []
candidate_id = 1

counts = {
    'Dice': 0, 'Mirror Image': 0, 'Paper Folding': 0, 'Embedded Figures': 0, 'Venn Diagram': 0
}

for file_block in files[1:]:
    lines = file_block.split('\n')
    filename = lines[0].strip().replace(' ---', '')
    
    questions = re.split(r'\nQ\.\d+ ', file_block)
    for idx, q in enumerate(questions[1:]):
        q_low = q.lower()
        topic = None
        
        # Dice logic
        if 'dice' in q_low or 'different positions' in q_low and 'face' in q_low:
            topic = 'Dice'
        # Mirror Image logic
        elif 'mirror' in q_low:
            topic = 'Mirror Image'
        # Paper Folding logic
        elif 'folded' in q_low and 'paper' in q_low:
            topic = 'Paper Folding'
        # Embedded Figures logic
        elif 'embedded' in q_low or 'hidden' in q_low:
            topic = 'Embedded Figures'
        # Venn Diagram logic
        elif 'venn' in q_low or 'following classes' in q_low:
            topic = 'Venn Diagram'
            
        if topic:
            counts[topic] += 1
            has_visual_ref = any(k in q_low for k in ['select the figure', 'which figure', 'given figure', 'shown in the', 'following figure', 'figure below', 'mirror', 'embedded', 'folded'])
            if not has_visual_ref:
                has_visual_ref = True
            
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

print(counts)
print(f"Extracted {len(candidates)} visual candidates")
with open('data/phase32_visual_candidates.json', 'w', encoding='utf-8') as f:
    json.dump({"candidates": candidates}, f, indent=2)
