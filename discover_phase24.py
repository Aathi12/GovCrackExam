import re
import json
import collections
from datetime import datetime

corpus_path = r'C:\Users\acer\OneDrive\SSC_CGL_ALL_PAPERS.txt'

with open(corpus_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Try to split by papers
papers = re.split(r'(SSC CGL QUESTION PAPER.*?)\n', text)
if len(papers) < 2:
    print("Could not split by papers.")

questions_by_topic = collections.defaultdict(list)

current_paper = "Unknown"
for i in range(1, len(papers), 2):
    current_paper = papers[i].strip()
    content = papers[i+1]
    
    # Split by questions
    q_blocks = re.split(r'\nQ\.\d+', content)
    
    for block in q_blocks[1:]:
        # Parse block
        question_text = ""
        options = []
        correct_opt = None
        
        lines = block.strip().split('\n')
        q_lines = []
        opts = {}
        ans = None
        
        for line in lines:
            line = line.strip()
            if not line: continue
            
            m_opt = re.match(r'^(1|2|3|4)[\.\)]\s*(.*)$', line)
            if m_opt:
                opts[int(m_opt.group(1))] = m_opt.group(2)
                continue
            
            if 'Correct Answer' in line or 'Chosen Option' in line:
                continue
                
            q_lines.append(line)
            
        question_text = " ".join(q_lines)
        
        # Determine topic based on heuristics
        q_lower = question_text.lower()
        topic = None
        
        if 'three of the following four' in q_lower or 'odd one out' in q_lower or 'different from the other' in q_lower:
            topic = 'Classification (Odd One Out)'
        elif 'mirror is held' in q_lower or 'mirror image' in q_lower:
            topic = 'Mirror Image'
        elif 'paper is folded' in q_lower or 'piece of paper is folded' in q_lower:
            topic = 'Paper Folding'
        elif 'embedded' in q_lower or 'hidden/embedded' in q_lower:
            topic = 'Embedded Figures'
        elif 'faces of a dice' in q_lower or 'opposite to the face' in q_lower or 'different positions of the same dice' in q_lower:
            topic = 'Dice'
        elif 'venn diagram' in q_lower or 'relationship between the following classes' in q_lower:
            topic = 'Venn Diagram'
        elif 'replace the question mark' in q_lower and 'series' in q_lower:
            # Letter-cluster Analogy / Series already exists in questions.json, BUT 'Number Series' is not explicitly listed in the 6 topics unless it's merged. Let's name it 'Number Series' since letter-cluster is mostly letters.
            if 'letter-cluster' not in q_lower:
                topic = 'Number/Figure Series'
        elif 'related to the third' in q_lower and ('word' in q_lower or 'number' in q_lower):
            topic = 'Analogy (Word/Number)'
            
        if topic:
            questions_by_topic[topic].append({
                'question': question_text,
                'options': [opts.get(1,''), opts.get(2,''), opts.get(3,''), opts.get(4,'')],
                'paper': current_paper
            })

report = {}
inventory = []

for topic, qs in questions_by_topic.items():
    # Deduplicate
    unique_qs = {}
    for q in qs:
        norm = re.sub(r'[^\w\s]', '', q['question'].lower())
        norm = re.sub(r'\s+', ' ', norm).strip()
        if norm not in unique_qs:
            unique_qs[norm] = q
    
    clean_candidates = []
    for norm, q in unique_qs.items():
        # Check if complete
        has_opts = all(q['options']) and len(q['options']) == 4
        # Check if relies on images
        relies_on_image = False
        if topic in ['Mirror Image', 'Paper Folding', 'Embedded Figures', 'Venn Diagram', 'Figure Series', 'Dice']:
            # Non-verbal reasoning in text corpora is usually missing figures
            relies_on_image = True
            
        # specifically if it says 'shown in the figure'
        if 'figure' in q['question'].lower() and not has_opts: # wait, if it says figure it might still have opts
            pass
            
        if has_opts and not relies_on_image:
            clean_candidates.append(q)
            
    status = "INSUFFICIENT DATA"
    if topic in ['Mirror Image', 'Paper Folding', 'Embedded Figures', 'Venn Diagram', 'Figure Series', 'Dice']:
        status = "INSUFFICIENT DATA (Requires Images)"
    elif len(clean_candidates) >= 20:
        status = "READY FOR VERIFICATION"
    elif len(clean_candidates) >= 5:
        status = "NEEDS MORE EXTRACTION"
        
    print(f"{topic}: {len(qs)} total occurrences, {len(unique_qs)} unique, {len(clean_candidates)} clean. Status: {status}")
    
    report[topic] = {
        'total': len(qs),
        'unique': len(unique_qs),
        'clean': len(clean_candidates),
        'status': status
    }
    
    inventory.append({
        'topic': topic,
        'cleanCandidateCount': len(clean_candidates),
        'paperOccurrenceCount': len(set(q['paper'] for q in qs)),
        'questionOccurrenceCount': len(qs),
        'status': status,
        'candidates': clean_candidates
    })

# Output JSON
out_json = {
    "generatedAt": datetime.now().isoformat(),
    "source": "SSC_CGL_ALL_PAPERS.txt",
    "topics": inventory
}

with open('data/phase24_candidates.json', 'w', encoding='utf-8') as f:
    json.dump(out_json, f, indent=2)

print("Created phase24_candidates.json")
