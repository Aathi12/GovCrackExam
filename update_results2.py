def update_app_js2():
    with open('js/app.js', 'r', encoding='utf-8') as f:
        content = f.read()

    # DIAGNOSTIC
    diag_search = '''    currentQuiz.forEach(q => {
        if (!topicStats[q.subtopic]) {
            topicStats[q.subtopic] = { total: 0, correct: 0 };
        }
        topicStats[q.subtopic].total++;
        
        if (userAnswers[q.qid] === q.correctOption) {
            topicStats[q.subtopic].correct++;
            totalCorrect++;
        }
    });'''
    diag_replace = '''    const difficultyPerformance = { Easy: {attempted:0, correct:0}, Medium: {attempted:0, correct:0}, Hard: {attempted:0, correct:0} };
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
    }'''
    content = content.replace(diag_search, diag_replace)

    # DRILL
    drill_search = '''    currentQuiz.forEach(q => {
        if (userAnswers[q.qid] === q.correctOption) totalCorrect++;
    });'''
    drill_replace = '''    const difficultyPerformance = { Easy: {attempted:0, correct:0}, Medium: {attempted:0, correct:0}, Hard: {attempted:0, correct:0} };
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
    }'''
    content = content.replace(drill_search, drill_replace)

    # FULL PRACTICE
    full_search = '''    currentQuiz.forEach(q => {
        if (!topicStats[q.subtopic]) {
            topicStats[q.subtopic] = { attempted: 0, correct: 0 };
        }
        topicStats[q.subtopic].attempted++;
        
        if (userAnswers[q.qid] === q.correctOption) {
            totalCorrect++;
            topicStats[q.subtopic].correct++;
        }
    });'''
    full_replace = '''    const difficultyPerformance = { Easy: {attempted:0, correct:0}, Medium: {attempted:0, correct:0}, Hard: {attempted:0, correct:0} };
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
    }'''
    content = content.replace(full_search, full_replace)

    with open('js/app.js', 'w', encoding='utf-8') as f:
        f.write(content)
        
if __name__ == '__main__':
    update_app_js2()
