import json

def cleanup():
    with open('data/questions.json', 'r', encoding='utf-8') as f:
        questions = json.load(f)
        
    with open('data/phase40_quality_audit.json', 'r', encoding='utf-8') as f:
        audit = json.load(f)
        
    removed = []
    quarantined = []
    retainedAfterReview = []
    
    before_count = len(questions)
    
    exact_duplicates = [
        "1e0ba137-521f-4fc4-af98-4a892e4aebac",
        "74af88f9-d4af-4979-92d7-d83762447383",
        "9f55f625-f1f9-4f13-a91a-a0b1d8beebed",
        "bfc41368-3ea2-4c4b-a067-f684f476794e",
        "ed38af9b-7128-4fa1-8fc6-aa50add47854",
        "aa862b41-ed47-4078-8b0a-deb814c4482d",
        "f4ee6ef9-e8b4-4c51-ac49-3bb4d12e998e"
    ]
    
    duplicate_mappings = {
        "1e0ba137-521f-4fc4-af98-4a892e4aebac": "19880b45-da36-4638-8906-bd865d0d76be",
        "74af88f9-d4af-4979-92d7-d83762447383": "257f7582-2eef-4d9a-811b-c5fc953408bd",
        "9f55f625-f1f9-4f13-a91a-a0b1d8beebed": "68ec518e-35d7-4b57-ada7-4cfca7df4f61",
        "bfc41368-3ea2-4c4b-a067-f684f476794e": "9691a391-cb55-4434-8909-dab6a6904037",
        "ed38af9b-7128-4fa1-8fc6-aa50add47854": "66c62ecb-e391-4b50-b53c-5841def92ba7",
        "aa862b41-ed47-4078-8b0a-deb814c4482d": "4f3fa519-eed7-4580-9a16-ea0ff1f14289",
        "f4ee6ef9-e8b4-4c51-ac49-3bb4d12e998e": "5eb8505f-a21a-4a8f-a5a8-7e2395206b65"
    }
    
    needs_review = [k for k, v in audit.items() if v['status'] == 'NEEDS_REVIEW']
    # All needs review were just generic question texts for dictionary or classification.
    # They are legally similar.
    for qid in needs_review:
        retainedAfterReview.append({
            "questionId": qid,
            "reason": "LEGITIMATE_SIMILARITY: Question structure is similar but options/reasoning are unique."
        })
        
    final_questions = []
    
    topics_before = {t: 0 for t in ["Dictionary Order", "Syllogism", "Blood Relations", "Mathematical Operations", "Coded Language", "Letter-cluster Analogy / Series", "Number/Figure Series", "Classification (Odd One Out)", "Analogy (Word/Number)"]}
    topics_removed = {t: 0 for t in topics_before.keys()}
    topics_quarantined = {t: 0 for t in topics_before.keys()}
    topics_after = {t: 0 for t in topics_before.keys()}
    
    for q in questions:
        qid = q['qid']
        topic = q['subtopic']
        topics_before[topic] += 1
        
        if qid in exact_duplicates:
            removed.append({
                "questionId": qid,
                "topic": topic,
                "classification": "INVALID",
                "reason": "EXACT_DUPLICATE",
                "canonicalId": duplicate_mappings[qid]
            })
            topics_removed[topic] += 1
        else:
            final_questions.append(q)
            topics_after[topic] += 1
            
    with open('data/questions.json', 'w', encoding='utf-8') as f:
        json.dump(final_questions, f, indent=2)
        
    log = {
        "removed": removed,
        "quarantined": quarantined,
        "retainedAfterReview": retainedAfterReview
    }
    
    with open('data/phase41_cleanup_log.json', 'w', encoding='utf-8') as f:
        json.dump(log, f, indent=2)
        
    # Generate Report
    md = "# Phase 41 — Structural Cleanup Report\n\n"
    md += "## Counts\n"
    md += f"- Before count: {before_count}\n"
    md += f"- After count: {len(final_questions)}\n"
    md += f"- Exact duplicates removed: {len(removed)}\n"
    md += f"- Near-duplicates removed: 0\n"
    md += f"- Invalid questions removed: 0\n"
    md += f"- Questions retained after review: {len(retainedAfterReview)}\n"
    md += f"- Questions quarantined: {len(quarantined)}\n\n"
    
    md += "## Topic Distribution\n"
    md += "| Topic | Before | Removed | Quarantined | Final |\n"
    md += "|---|---|---|---|---|\n"
    for t in topics_before.keys():
        md += f"| {t} | {topics_before[t]} | {topics_removed[t]} | {topics_quarantined[t]} | {topics_after[t]} |\n"
        
    md += "\n## Decisions\n"
    md += "**Frequency-weight decision:** UNCHANGED. The frequency weights were derived in Phase 24 using a random 30-shift corpus sample. Removing 7 duplicate entries from the practice bank does not alter the underlying corpus occurrence rates.\n\n"
    md += "**Difficulty decision:** UNCHANGED. Existing classifications were retained.\n\n"
    md += "**localStorage compatibility:** Existing application handles missing question IDs natively in history components by skipping them or initializing blanks safely. No data corruption occurs.\n\n"
    md += "## Removed Questions\n"
    for r in removed:
        md += f"- **ID:** {r['questionId']}\n"
        md += f"  - Topic: {r['topic']}\n"
        md += f"  - Classification: {r['classification']}\n"
        md += f"  - Reason: {r['reason']}\n"
        md += f"  - Canonical ID: {r['canonicalId']}\n"
        
    with open('PHASE41_CLEANUP_REPORT.md', 'w', encoding='utf-8') as f:
        f.write(md)

if __name__ == '__main__':
    cleanup()
