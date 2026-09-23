import json
from collections import Counter

def classify_question(q):
    topic = q.get('subtopic', '')
    text = q.get('question', '').lower()
    exp = q.get('explanation', '').lower()
    
    if topic == 'Dictionary Order':
        if len(q.get('options', [])) >= 4 and any(',' in opt for opt in q.get('options', [])):
            return 'Medium'
        if '1.' in text and '6.' in text:
            return 'Hard'
        return 'Medium'

    elif topic == 'Syllogism':
        statements_count = text.count('statement') + text.count('i.') + text.count('ii.') + text.count('iii.') + text.count('iv.')
        if statements_count >= 5 or 'possibility' in text:
            return 'Hard'
        elif statements_count >= 3:
            return 'Medium'
        return 'Easy'

    elif topic == 'Blood Relations':
        if '+' in text and '-' in text and ('*' in text or '%' in text or '@' in text or '&' in text or '#' in text):
            ops = sum([1 for x in ['+', '-', '*', '/', '%', '@', '&', '#'] if x in text])
            if ops >= 4:
                return 'Hard'
            return 'Medium'
        if len(text.split()) > 40:
            return 'Hard'
        return 'Medium'

    elif topic == 'Mathematical Operations':
        if '*' in exp and '+' in exp and '-' in exp and '/' in exp and len(exp.split()) > 20:
            return 'Hard'
        if 'interchanged' in text and ('signs and' in text or 'numbers' in text):
            return 'Hard'
        return 'Medium'

    elif topic == 'Coded Language':
        if 'sum' in exp or 'vowel' in exp or 'consonant' in exp or 'reverse' in exp:
            return 'Hard'
        if '+' in exp and '-' in exp:
            return 'Medium'
        return 'Medium'

    elif topic == 'Letter-cluster Analogy / Series':
        if 'alternating' in exp or 'reverse' in exp:
            return 'Hard'
        if '+1' in exp or '-1' in exp:
            if '+2' not in exp and '+3' not in exp:
                return 'Easy'
        return 'Medium'

    elif topic == 'Number/Figure Series':
        if 'difference' in exp and 'second' in exp:
            return 'Hard'
        if '^2' in exp or 'square' in exp or 'cube' in exp or '^3' in exp:
            return 'Hard'
        return 'Medium'

    elif topic == 'Classification (Odd One Out)':
        if 'sum' in exp or 'square' in exp or 'cube' in exp:
            return 'Hard'
        if 'vowel' in exp or 'consonant' in exp:
            return 'Medium'
        return 'Medium'

    elif topic == 'Analogy (Word/Number)':
        if '^2' in exp or 'square' in exp or 'cube' in exp or '^3' in exp:
            return 'Hard'
        if len(text.split()) < 20:
            return 'Easy'
        return 'Medium'
        
    return 'Medium'

def main():
    with open('data/questions.json', 'r', encoding='utf-8') as f:
        questions = json.load(f)

    # Make a backup
    with open('data/questions_backup_phase35.json', 'w', encoding='utf-8') as f:
        json.dump(questions, f, indent=2)
        
    difficulty_map = {}
    difficulty_counts = Counter()
    topic_difficulty = Counter()

    for q in questions:
        diff = classify_question(q)
        q['difficulty'] = diff
        difficulty_map[q['qid']] = diff
        difficulty_counts[diff] += 1
        topic_difficulty[f"{q['subtopic']} - {diff}"] += 1

    with open('data/phase35_difficulty.json', 'w', encoding='utf-8') as f:
        json.dump(difficulty_map, f, indent=2)

    with open('data/questions.json', 'w', encoding='utf-8') as f:
        json.dump(questions, f, indent=2)

    print(f"Total processed: {len(questions)}")
    print(f"Distribution: {dict(difficulty_counts)}")
    for td, count in topic_difficulty.most_common():
        print(f"  {td}: {count}")

if __name__ == '__main__':
    main()
