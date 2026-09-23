def patch_select_drill():
    with open('js/app.js', 'r', encoding='utf-8') as f:
        js = f.read()

    search = '''function selectDrillQuestions(count, topics) {
    const history = getSavedHistory();
    const previouslySeen = new Set();
    // In a real app we might track all seen questions. For this pilot, 
    // we'll just try to pick questions from the weak topics.
    
    let pool = questionsBank.filter(q => topics.includes(q.subtopic));
    pool = pool.sort(() => 0.5 - Math.random());
    return pool.slice(0, count);
}'''

    replace = '''function selectDrillQuestions(count, topics) {
    const history = getSavedHistory() || {};
    const qh = history.questionHistory || {};
    const toggle = document.getElementById('adaptive-drill-toggle');
    const isAdaptive = toggle ? toggle.checked : true;
    
    let pool = questionsBank.filter(q => topics.includes(q.subtopic));
    
    if (isAdaptive) {
        pool.forEach(q => {
            const h = qh[q.qid];
            let score = 0;
            
            if (!h || h.attempts === 0) {
                // A. Unseen bonus (very high to ensure fresh coverage)
                score = 120;
            } else {
                // B. Low personal accuracy (0 to 100)
                const historyWeakness = 100 - h.accuracy;
                
                // C. Frequently incorrect (capped at 50)
                const repeatMissBonus = Math.min(h.incorrect * 10, 50);
                
                // D. Recent incorrect
                const recentMissBonus = (h.lastResult === 'incorrect') ? 30 : 0;
                
                // E. Difficulty adjustment (gently prioritize Easy base, defer Hard if equally missed)
                let diffAdj = 0;
                if (q.difficulty === 'Easy') diffAdj = 10;
                if (q.difficulty === 'Hard') diffAdj = -10;
                
                // F. Mastered / Recent correct penalty
                let masteredPenalty = 0;
                let recentCorrectPenalty = 0;
                if (h.attempts >= 3 && h.accuracy >= 80 && h.currentStreak >= 2) {
                    masteredPenalty = -100;
                } else if (h.lastResult === 'correct') {
                    recentCorrectPenalty = -40;
                }
                
                score = historyWeakness + repeatMissBonus + recentMissBonus + diffAdj + masteredPenalty + recentCorrectPenalty;
            }
            
            // Add tiny random noise (0 to 5) to break exact ties unpredictably
            q._adaptiveScore = score + (Math.random() * 5);
        });
        
        // Sort descending
        pool = pool.sort((a, b) => b._adaptiveScore - a._adaptiveScore);
    } else {
        // Legacy purely random fallback
        pool = pool.sort(() => 0.5 - Math.random());
    }
    
    // Store metadata for results screen
    window.currentDrillIsAdaptive = isAdaptive;
    
    return pool.slice(0, count);
}'''

    if 'function selectDrillQuestions(count, topics)' in js:
        js = js.replace(search, replace)
        
    
    results_search = '''    comparisonContainer.innerHTML = `
        <div>Diagnostic Accuracy: ${diagnosticAccuracy}%</div>
        <div>Drill Accuracy: ${drillAccuracy}%</div>
        <div class="${changeClass}">Change: ${sign}${change} percentage points</div>
    `;'''
    results_replace = '''    comparisonContainer.innerHTML = `
        <div>Diagnostic Accuracy: ${diagnosticAccuracy}%</div>
        <div>Drill Accuracy: ${drillAccuracy}%</div>
        <div class="${changeClass}">Change: ${sign}${change} percentage points</div>
    `;
    
    if (window.currentDrillIsAdaptive) {
        comparisonContainer.innerHTML += `
        <div style="margin-top: 15px; padding: 10px; background: rgba(59, 130, 246, 0.1); border-left: 3px solid var(--primary-color); border-radius: 4px; font-size: 0.85rem; text-align: left;">
            <strong>Adaptive Drill</strong><br>
            Topic prioritized: ${primaryTopic}<br>
            Questions selected based on your recorded practice history and difficulty. All calculations are local to this browser.
        </div>`;
    }'''
    if 'Adaptive Drill' not in js:
        js = js.replace(results_search, results_replace)

    # 3. Save adaptive state in history.drills
    save_search = '''        change: change,
        difficultyPerformance: difficultyPerformance,
        topicDiff: topicDiff
    });'''
    save_replace = '''        change: change,
        difficultyPerformance: difficultyPerformance,
        topicDiff: topicDiff,
        adaptive: window.currentDrillIsAdaptive || false
    });'''
    if 'adaptive: window.currentDrillIsAdaptive' not in js:
        js = js.replace(save_search, save_replace)
        
    with open('js/app.js', 'w', encoding='utf-8') as f:
        f.write(js)

if __name__ == '__main__':
    patch_select_drill()
