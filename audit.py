import json
import re
import collections

def audit_questions():
    with open('data/questions.json', 'r', encoding='utf-8') as f:
        questions = json.load(f)
        
    audit_results = {}
    topic_summary = collections.defaultdict(lambda: {'Total': 0, 'VERIFIED': 0, 'MINOR_ISSUE': 0, 'NEEDS_REVIEW': 0, 'INVALID': 0})
    
    exact_duplicates = 0
    near_duplicates = 0
    
    seen_texts = {}
    seen_signatures = {}

    for q in questions:
        qid = q['qid']
        topic = q['subtopic']
        status = 'VERIFIED'
        issues = []
        notes = ''
        
        topic_summary[topic]['Total'] += 1
        
        # 1. Option Quality
        options = q.get('options', [])
        if len(options) != 4:
            status = 'INVALID'
            issues.append(f"Expected 4 options, found {len(options)}")
            
        if len(set(options)) != len(options):
            status = 'INVALID'
            issues.append("Duplicate options found")
            
        correct = q.get('correctOption')
        if correct not in [1, 2, 3, 4]:
            status = 'INVALID'
            issues.append(f"Invalid correctOption: {correct}")
            
        # 2. Text Quality & OCR
        text = q.get('question', '')
        if not text.strip():
            status = 'INVALID'
            issues.append("Empty question text")
            
        # OCR checks - look for common OCR corruption markers
        # The character \ufffd is often used for replacement
        if '\ufffd' in text or text.count('?') > 3:
            status = 'MINOR_ISSUE' if status == 'VERIFIED' else status
            issues.append("Possible OCR corruption in question")
            
        if any('\ufffd' in opt for opt in options):
            status = 'MINOR_ISSUE' if status == 'VERIFIED' else status
            issues.append("Possible OCR corruption in options")
            
        # 3. Explanation Audit
        exp = q.get('explanation', '')
        if not exp.strip():
            status = 'MINOR_ISSUE' if status == 'VERIFIED' else status
            issues.append("Missing explanation")
        elif len(exp) < 10:
            status = 'MINOR_ISSUE' if status == 'VERIFIED' else status
            issues.append("Explanation too short to be useful")
            
        # 4. Dictionary Order specific check
        if topic == 'Dictionary Order':
            words = re.findall(r'\d\.\s*([A-Za-z]+)', text)
            if words:
                sorted_words = sorted(words)
            if not words:
                status = 'NEEDS_REVIEW' if status == 'VERIFIED' else status
                issues.append("Could not parse words to order")
                
        # 5. Duplicates
        norm_text = re.sub(r'[^a-z0-9]', '', text.lower())
        if norm_text in seen_texts:
            status = 'NEEDS_REVIEW' if status == 'VERIFIED' else status
            issues.append(f"Near duplicate of {seen_texts[norm_text]}")
            near_duplicates += 1
        else:
            seen_texts[norm_text] = qid
            
        sig = json.dumps({'q': norm_text, 'o': options, 'c': correct})
        if sig in seen_signatures:
            status = 'INVALID'
            issues.append(f"Exact duplicate of {seen_signatures[sig]}")
            exact_duplicates += 1
        else:
            seen_signatures[sig] = qid
            
        if not issues:
            notes = "Structurally verified."
        else:
            notes = "Identified issues during automated audit."
            
        audit_results[qid] = {
            'status': status,
            'issues': issues,
            'notes': notes
        }
        
        topic_summary[topic][status] += 1

    with open('data/phase40_quality_audit.json', 'w', encoding='utf-8') as f:
        json.dump(audit_results, f, indent=2)
        
    # Generate Report
    md = "# Phase 40 — Question Quality Audit\n\n"
    md += "## Per-Topic Summary\n\n"
    md += "| Topic | Total | Verified | Minor Issue | Needs Review | Invalid |\n"
    md += "|---|---|---|---|---|---|\n"
    
    global_total = 0
    global_verified = 0
    global_minor = 0
    global_review = 0
    global_invalid = 0
    
    for topic, counts in topic_summary.items():
        md += f"| {topic} | {counts['Total']} | {counts['VERIFIED']} | {counts['MINOR_ISSUE']} | {counts['NEEDS_REVIEW']} | {counts['INVALID']} |\n"
        global_total += counts['Total']
        global_verified += counts['VERIFIED']
        global_minor += counts['MINOR_ISSUE']
        global_review += counts['NEEDS_REVIEW']
        global_invalid += counts['INVALID']
        
    md += "\n## Global Summary\n\n"
    md += f"- Total Questions: {global_total}\n"
    md += f"- VERIFIED: {global_verified}\n"
    md += f"- MINOR_ISSUE: {global_minor}\n"
    md += f"- NEEDS_REVIEW: {global_review}\n"
    md += f"- INVALID: {global_invalid}\n"
    md += f"- Exact Duplicates: {exact_duplicates}\n"
    md += f"- Probable Near-Duplicates: {near_duplicates}\n\n"
    
    md += "## Issues Detailed\n\n"
    for q in questions:
        qid = q['qid']
        res = audit_results[qid]
        if res['status'] != 'VERIFIED':
            md += f"### {qid}\n"
            md += f"- **Topic:** {q['subtopic']}\n"
            md += f"- **Classification:** {res['status']}\n"
            md += f"- **Issues:** {', '.join(res['issues'])}\n"
            md += f"- **Notes:** {res['notes']}\n\n"
            
    with open('PHASE40_QUESTION_QUALITY_AUDIT.md', 'w', encoding='utf-8') as f:
        f.write(md)

if __name__ == '__main__':
    audit_questions()
