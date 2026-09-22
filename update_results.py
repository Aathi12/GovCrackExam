import re

def update_app_js():
    with open('js/app.js', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update calculateDiagnosticResults
    diag_replacement = """
    const difficultyPerformance = { Easy: {attempted:0, correct:0}, Medium: {attempted:0, correct:0}, Hard: {attempted:0, correct:0} };

    currentQuiz.forEach(q => {
        if (!topicStats[q.subtopic]) {
            topicStats[q.subtopic] = { total: 0, correct: 0 };
        }
        topicStats[q.subtopic].total++;
        
        let diff = q.difficulty || 'Medium';
        difficultyPerformance[diff].attempted++;
        
        if (userAnswers[q.qid] === q.correctOption) {
            topicStats[q.subtopic].correct++;
            totalCorrect++;
            difficultyPerformance[diff].correct++;
        }
    });

    for(let diff in difficultyPerformance) {
        let d = difficultyPerformance[diff];
        d.accuracy = d.attempted > 0 ? Math.round((d.correct/d.attempted)*100) : 0;
    }
"""
    # Replace the forEach loop in calculateDiagnosticResults
    content = re.sub(r'currentQuiz\.forEach\(q => \{.*?\n    \}\);', diag_replacement.strip(), content, flags=re.DOTALL, count=1)
    
    # Inject difficultyPerformance into results object
    content = content.replace('topics: {}', 'topics: {},\n        difficultyPerformance: difficultyPerformance')

    # 2. Update calculateDrillResults
    drill_replacement = """
    const difficultyPerformance = { Easy: {attempted:0, correct:0}, Medium: {attempted:0, correct:0}, Hard: {attempted:0, correct:0} };
    
    currentQuiz.forEach(q => {
        let diff = q.difficulty || 'Medium';
        difficultyPerformance[diff].attempted++;
        if (userAnswers[q.qid] === q.correctOption) {
            totalCorrect++;
            difficultyPerformance[diff].correct++;
        }
    });
    
    for(let diff in difficultyPerformance) {
        let d = difficultyPerformance[diff];
        d.accuracy = d.attempted > 0 ? Math.round((d.correct/d.attempted)*100) : 0;
    }
"""
    content = re.sub(r'currentQuiz\.forEach\(q => \{.*?\n    \}\);', drill_replacement.strip(), content, flags=re.DOTALL, count=1)
    
    # Add to history.drills.unshift
    content = content.replace('change: change', 'change: change,\n        difficultyPerformance: difficultyPerformance')

    # 3. Update calculateTopicPracticeResults
    topic_replacement = """
    const difficultyPerformance = { Easy: {attempted:0, correct:0}, Medium: {attempted:0, correct:0}, Hard: {attempted:0, correct:0} };

    currentQuiz.forEach(q => {
        let diff = q.difficulty || 'Medium';
        difficultyPerformance[diff].attempted++;
        if (userAnswers[q.qid] === q.correctOption) {
            totalCorrect++;
            difficultyPerformance[diff].correct++;
        }
    });
    
    for(let diff in difficultyPerformance) {
        let d = difficultyPerformance[diff];
        d.accuracy = d.attempted > 0 ? Math.round((d.correct/d.attempted)*100) : 0;
    }
"""
    content = re.sub(r'currentQuiz\.forEach\(q => \{.*?\n    \}\);', topic_replacement.strip(), content, flags=re.DOTALL, count=1)
    content = content.replace('topic: topicPracticed,', 'topic: topicPracticed,\n        difficultyPerformance: difficultyPerformance,')

    # 4. Update calculateFullPracticeResults
    full_replacement = """
    const difficultyPerformance = { Easy: {attempted:0, correct:0}, Medium: {attempted:0, correct:0}, Hard: {attempted:0, correct:0} };

    currentQuiz.forEach(q => {
        if (!topicStats[q.subtopic]) {
            topicStats[q.subtopic] = { attempted: 0, correct: 0 };
        }
        topicStats[q.subtopic].attempted++;
        
        let diff = q.difficulty || 'Medium';
        difficultyPerformance[diff].attempted++;
        
        if (userAnswers[q.qid] === q.correctOption) {
            totalCorrect++;
            topicStats[q.subtopic].correct++;
            difficultyPerformance[diff].correct++;
        }
    });
    
    for(let diff in difficultyPerformance) {
        let d = difficultyPerformance[diff];
        d.accuracy = d.attempted > 0 ? Math.round((d.correct/d.attempted)*100) : 0;
    }
"""
    content = re.sub(r'currentQuiz\.forEach\(q => \{.*?\n    \}\);', full_replacement.strip(), content, flags=re.DOTALL, count=1)
    content = content.replace('topicPerformance: topicPerformance', 'topicPerformance: topicPerformance,\n        difficultyPerformance: difficultyPerformance')

    # 5. Update renderMistakes
    mistake_badge = """
        const safeQ = escapeHTML(q.question);
        const safeUserAns = escapeHTML(userOptText);
        const safeCorrectAns = escapeHTML(correctOptText);
        const safeExplanation = escapeHTML(q.explanation || 'No explanation available.').replace(/\\n/g, '<br>');
        
        const diff = q.difficulty || 'Medium';
        const badgeColor = diff === 'Easy' ? '#10b981' : (diff === 'Hard' ? '#ef4444' : '#f59e0b');
        
        html += `
        <div class="mistake-item card" style="margin-bottom: 15px; text-align: left; padding: 15px; background-color: var(--card-bg); border: 1px solid var(--border-color); border-radius: 6px;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <p style="font-weight: 600; margin-bottom: 15px;">Q${idx + 1}. ${safeQ}</p>
                <span style="font-size: 0.75rem; padding: 3px 6px; border-radius: 4px; background-color: ${badgeColor}; color: white; margin-left: 10px;">${diff}</span>
            </div>
    """
    
    content = re.sub(
        r'const safeQ.*?html \+\= `.*?<p style="font-weight: 600; margin-bottom: 15px;">Q\$\{idx \+ 1\}\. \$\{safeQ\}</p>', 
        mistake_badge.strip(), 
        content, 
        flags=re.DOTALL
    )

    with open('js/app.js', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == '__main__':
    update_app_js()
