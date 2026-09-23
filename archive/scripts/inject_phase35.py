import re

def update_app_js():
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
    const topicDiff = {};
    currentQuiz.forEach(q => {
        if (!topicStats[q.subtopic]) topicStats[q.subtopic] = { total: 0, correct: 0 };
        if (!topicDiff[q.subtopic]) topicDiff[q.subtopic] = { Easy: {attempted:0, correct:0}, Medium: {attempted:0, correct:0}, Hard: {attempted:0, correct:0} };
        topicStats[q.subtopic].total++;
        
        let diff = q.difficulty || 'Medium';
        difficultyPerformance[diff].attempted++;
        topicDiff[q.subtopic][diff].attempted++;
        
        if (userAnswers[q.qid] === q.correctOption) {
            topicStats[q.subtopic].correct++;
            totalCorrect++;
            difficultyPerformance[diff].correct++;
            topicDiff[q.subtopic][diff].correct++;
        }
    });
    for(let diff in difficultyPerformance) {
        let d = difficultyPerformance[diff];
        d.accuracy = d.attempted > 0 ? Math.round((d.correct/d.attempted)*100) : 0;
    }'''
    content = content.replace(diag_search, diag_replace)
    content = content.replace('topics: {}', 'topics: {},\n        difficultyPerformance: difficultyPerformance,\n        topicDiff: topicDiff')

    # DRILL
    drill_search = '''    currentQuiz.forEach(q => {
        if (userAnswers[q.qid] === q.correctOption) totalCorrect++;
    });'''
    drill_replace = '''    const difficultyPerformance = { Easy: {attempted:0, correct:0}, Medium: {attempted:0, correct:0}, Hard: {attempted:0, correct:0} };
    const topicDiff = {};
    currentQuiz.forEach(q => {
        if (!topicDiff[q.subtopic]) topicDiff[q.subtopic] = { Easy: {attempted:0, correct:0}, Medium: {attempted:0, correct:0}, Hard: {attempted:0, correct:0} };
        let diff = q.difficulty || 'Medium';
        difficultyPerformance[diff].attempted++;
        topicDiff[q.subtopic][diff].attempted++;
        if (userAnswers[q.qid] === q.correctOption) {
            totalCorrect++;
            difficultyPerformance[diff].correct++;
            topicDiff[q.subtopic][diff].correct++;
        }
    });
    for(let diff in difficultyPerformance) {
        let d = difficultyPerformance[diff];
        d.accuracy = d.attempted > 0 ? Math.round((d.correct/d.attempted)*100) : 0;
    }'''
    content = content.replace(drill_search, drill_replace)
    content = content.replace('change: change', 'change: change,\n        difficultyPerformance: difficultyPerformance,\n        topicDiff: topicDiff')

    # TOPIC PRACTICE
    topic_search = '''    currentQuiz.forEach(q => {
        if (userAnswers[q.qid] === q.correctOption) totalCorrect++;
    });'''
    topic_replace = '''    const difficultyPerformance = { Easy: {attempted:0, correct:0}, Medium: {attempted:0, correct:0}, Hard: {attempted:0, correct:0} };
    const topicDiff = {};
    currentQuiz.forEach(q => {
        if (!topicDiff[q.subtopic]) topicDiff[q.subtopic] = { Easy: {attempted:0, correct:0}, Medium: {attempted:0, correct:0}, Hard: {attempted:0, correct:0} };
        let diff = q.difficulty || 'Medium';
        difficultyPerformance[diff].attempted++;
        topicDiff[q.subtopic][diff].attempted++;
        if (userAnswers[q.qid] === q.correctOption) {
            totalCorrect++;
            difficultyPerformance[diff].correct++;
            topicDiff[q.subtopic][diff].correct++;
        }
    });
    for(let diff in difficultyPerformance) {
        let d = difficultyPerformance[diff];
        d.accuracy = d.attempted > 0 ? Math.round((d.correct/d.attempted)*100) : 0;
    }'''
    content = content.replace(topic_search, topic_replace)
    content = content.replace('topic: topicPracticed,', 'topic: topicPracticed,\n        difficultyPerformance: difficultyPerformance,\n        topicDiff: topicDiff,')

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
    const topicDiff = {};
    currentQuiz.forEach(q => {
        if (!topicStats[q.subtopic]) {
            topicStats[q.subtopic] = { attempted: 0, correct: 0 };
        }
        if (!topicDiff[q.subtopic]) topicDiff[q.subtopic] = { Easy: {attempted:0, correct:0}, Medium: {attempted:0, correct:0}, Hard: {attempted:0, correct:0} };
        topicStats[q.subtopic].attempted++;
        
        let diff = q.difficulty || 'Medium';
        difficultyPerformance[diff].attempted++;
        topicDiff[q.subtopic][diff].attempted++;
        
        if (userAnswers[q.qid] === q.correctOption) {
            totalCorrect++;
            topicStats[q.subtopic].correct++;
            difficultyPerformance[diff].correct++;
            topicDiff[q.subtopic][diff].correct++;
        }
    });
    for(let diff in difficultyPerformance) {
        let d = difficultyPerformance[diff];
        d.accuracy = d.attempted > 0 ? Math.round((d.correct/d.attempted)*100) : 0;
    }'''
    content = content.replace(full_search, full_replace)
    content = content.replace('topicPerformance: topicPerformance', 'topicPerformance: topicPerformance,\n        difficultyPerformance: difficultyPerformance,\n        topicDiff: topicDiff')

    # MISTAKE RENDER
    mistake_search = r'''const safeQ = escapeHTML\(q\.question\);\n\s*const safeUserAns = escapeHTML\(userOptText\);\n\s*const safeCorrectAns = escapeHTML\(correctOptText\);\n\s*const safeExplanation = escapeHTML\(q\.explanation \|\| 'No explanation available\.'\)\.replace\(/\\n/g, '<br>'\);\n\s*html \+\= `\n\s*<div class="mistake-item card" style="margin-bottom: 15px; text-align: left; padding: 15px; background-color: var\(--card-bg\); border: 1px solid var\(--border-color\); border-radius: 6px;">\n\s*<p style="font-weight: 600; margin-bottom: 15px;">Q\$\{idx \+ 1\}\. \$\{safeQ\}</p>'''
    mistake_replace = '''const safeQ = escapeHTML(q.question);
        const safeUserAns = escapeHTML(userOptText);
        const safeCorrectAns = escapeHTML(correctOptText);
        const safeExplanation = escapeHTML(q.explanation || 'No explanation available.').replace(/\\n/g, '<br>');
        const diff = q.difficulty || 'Medium';
        const badgeColor = diff === 'Easy' ? '#10b981' : (diff === 'Hard' ? '#ef4444' : '#f59e0b');
        
        html += `
        <div class="mistake-item card" style="margin-bottom: 15px; text-align: left; padding: 15px; background-color: var(--card-bg); border: 1px solid var(--border-color); border-radius: 6px;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 15px;">
                <p style="font-weight: 600; margin: 0;">Q${idx + 1}. ${safeQ}</p>
                <span style="font-size: 0.75rem; padding: 3px 6px; border-radius: 4px; background-color: ${badgeColor}; color: white; margin-left: 10px; flex-shrink: 0;">${diff}</span>
            </div>'''
    content = re.sub(mistake_search, mistake_replace, content, flags=re.MULTILINE)

    # SHOW PROGRESS SCREEN - Topic x Difficulty Table
    prog_search = '''    html += '</tbody></table></div>';'''
    prog_replace = '''    html += '</tbody></table></div>';
    
    // Topic x Difficulty Summary
    const txD = {};
    topics.forEach(t => { txD[t] = { Easy: {c:0, a:0}, Medium: {c:0, a:0}, Hard: {c:0, a:0} }; });
    
    function addTxD(records) {
        records.forEach(r => {
            if (r.topicDiff) {
                for (let t in r.topicDiff) {
                    if (txD[t]) {
                        ['Easy', 'Medium', 'Hard'].forEach(lvl => {
                            if (r.topicDiff[t][lvl]) {
                                txD[t][lvl].a += r.topicDiff[t][lvl].attempted;
                                txD[t][lvl].c += r.topicDiff[t][lvl].correct;
                            }
                        });
                    }
                }
            }
        });
    }
    addTxD(diags); addTxD(drills); addTxD(topicPractices); addTxD(fullPractices);
    
    let hasTxD = false;
    for (let t in txD) {
        if (txD[t].Easy.a > 0 || txD[t].Medium.a > 0 || txD[t].Hard.a > 0) hasTxD = true;
    }
    
    if (hasTxD) {
        html += '<h3 style="margin-top: 30px;">Topic by Difficulty Performance</h3>';
        html += '<div class="progress-table-container"><table class="progress-table" style="font-size: 0.9rem;"><thead><tr><th>Topic</th><th>Easy</th><th>Medium</th><th>Hard</th></tr></thead><tbody>';
        
        topics.forEach(t => {
            let ez = txD[t].Easy.a > 0 ? `${Math.round(txD[t].Easy.c/txD[t].Easy.a*100)}%` : '-';
            let md = txD[t].Medium.a > 0 ? `${Math.round(txD[t].Medium.c/txD[t].Medium.a*100)}%` : '-';
            let hd = txD[t].Hard.a > 0 ? `${Math.round(txD[t].Hard.c/txD[t].Hard.a*100)}%` : '-';
            
            if (ez !== '-' || md !== '-' || hd !== '-') {
                html += `<tr><td>${t}</td><td>${ez}</td><td>${md}</td><td>${hd}</td></tr>`;
            }
        });
        html += '</tbody></table></div>';
    }
    '''
    content = content.replace(prog_search, prog_replace)

    # SHOW PROGRESS SCREEN - Overall Difficulty
    diff_html_inject_search = '''    if (diags.length === 0 && drills.length === 0 && topicPractices.length === 0 && fullPractices.length === 0) {'''
    diff_html_inject_replace = '''
    let aggDiff = { Easy: {att:0, cor:0}, Medium: {att:0, cor:0}, Hard: {att:0, cor:0} };
    function addDiff(histArray) {
        histArray.forEach(record => {
            if (record.difficultyPerformance) {
                for (let lvl of ['Easy', 'Medium', 'Hard']) {
                    if (record.difficultyPerformance[lvl]) {
                        aggDiff[lvl].att += record.difficultyPerformance[lvl].attempted;
                        aggDiff[lvl].cor += record.difficultyPerformance[lvl].correct;
                    }
                }
            }
        });
    }
    addDiff(diags); addDiff(drills); addDiff(topicPractices); addDiff(fullPractices);
    
    let diffHtml = '';
    if (aggDiff.Easy.att > 0 || aggDiff.Medium.att > 0 || aggDiff.Hard.att > 0) {
        diffHtml = '<div class="card" style="margin-bottom: 20px;"><h3 style="margin-bottom:10px;">Difficulty Performance</h3><div style="display:flex; gap:10px; flex-wrap:wrap;">';
        for (let lvl of ['Easy', 'Medium', 'Hard']) {
            if (aggDiff[lvl].att > 0) {
                let acc = Math.round((aggDiff[lvl].cor / aggDiff[lvl].att) * 100);
                let color = lvl==='Easy'?'#10b981' : (lvl==='Hard'?'#ef4444' : '#f59e0b');
                diffHtml += `<div style="flex:1; min-width: 100px; text-align:center; padding: 15px; border: 1px solid ${color}; border-radius: 6px; background: rgba(255,255,255,0.02);">
                    <div style="font-weight:bold; color: ${color}; margin-bottom:5px;">${lvl}</div>
                    <div style="font-size:1.2rem; margin-bottom:5px;">${acc}%</div>
                    <div style="font-size:0.8rem; color: var(--text-muted);">${aggDiff[lvl].cor} / ${aggDiff[lvl].att}</div>
                </div>`;
            } else {
                diffHtml += `<div style="flex:1; min-width: 100px; text-align:center; padding: 15px; border: 1px solid var(--border-color); border-radius: 6px; background: rgba(255,255,255,0.02); opacity: 0.5;">
                    <div style="font-weight:bold; color: var(--text-muted); margin-bottom:5px;">${lvl}</div>
                    <div style="font-size:0.9rem;">No data</div>
                </div>`;
            }
        }
        diffHtml += '</div></div>';
    }

    if (diags.length === 0 && drills.length === 0 && topicPractices.length === 0 && fullPractices.length === 0) {'''
    content = content.replace(diff_html_inject_search, diff_html_inject_replace)
    
    # Prepend difficulty html to progress content
    content_search = '''    // Handle Feedback UI'''
    content_replace = '''
    // Prepend difficulty html
    content.innerHTML = diffHtml + content.innerHTML;
    // Handle Feedback UI'''
    content = content.replace(content_search, content_replace)
    
    # RENDER RESULTS SCREEN appending difficulty
    render_res_search = '''    const reviewContainer = document.getElementById('diagnostic-review');'''
    render_res_replace = '''
    const diffContainer = document.getElementById('difficulty-results');
    if (diffContainer && results.difficultyPerformance) {
        let dh = '<h3 style="margin-bottom: 10px;">Difficulty Performance</h3><div style="display:flex; gap:10px; margin-bottom: 20px;">';
        ['Easy', 'Medium', 'Hard'].forEach(lvl => {
            if (results.difficultyPerformance[lvl] && results.difficultyPerformance[lvl].attempted > 0) {
                const d = results.difficultyPerformance[lvl];
                let color = lvl==='Easy'?'#10b981' : (lvl==='Hard'?'#ef4444' : '#f59e0b');
                dh += `<div class="card" style="flex:1; text-align:center; border: 1px solid ${color};">
                    <div style="font-weight:bold; margin-bottom:5px; color:${color};">${lvl}</div>
                    <div>${d.correct} / ${d.attempted}</div>
                    <div>${d.accuracy}%</div>
                </div>`;
            }
        });
        dh += '</div>';
        diffContainer.innerHTML = dh;
    }
    const reviewContainer = document.getElementById('diagnostic-review');'''
    content = content.replace(render_res_search, render_res_replace)

    # TOPIC PRACTICE filtering logic
    start_tp_search = '''function startTopicPractice(topic) {'''
    start_tp_replace = '''function startTopicPractice(topic) {
    const diffSelect = document.getElementById('difficulty-select');
    const difficultyFilter = diffSelect ? diffSelect.value : 'All';'''
    content = content.replace(start_tp_search, start_tp_replace)
    
    tp_filter_search = '''    let eligibleQuestions = questions.filter(q => q.subtopic === topic);'''
    tp_filter_replace = '''    let eligibleQuestions = questions.filter(q => q.subtopic === topic);
    if (difficultyFilter !== 'All') {
        eligibleQuestions = eligibleQuestions.filter(q => (q.difficulty || 'Medium') === difficultyFilter);
    }
    
    if (eligibleQuestions.length === 0) {
        alert("No questions found for the selected difficulty.");
        return;
    }'''
    content = content.replace(tp_filter_search, tp_filter_replace)

    with open('js/app.js', 'w', encoding='utf-8') as f:
        f.write(content)


def update_index():
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    topic_select_search = '''                    <select id="topic-select" class="dropdown" style="width: 100%; margin-bottom: 20px;">
                        <option value="Dictionary Order">Dictionary Order</option>
                        <option value="Syllogism">Syllogism</option>
                        <option value="Blood Relations">Blood Relations</option>
                        <option value="Mathematical Operations">Mathematical Operations</option>
                        <option value="Coded Language">Coded Language</option>
                        <option value="Letter-cluster Analogy / Series">Letter-cluster Analogy / Series</option>
                        <option value="Number/Figure Series">Number/Figure Series</option>
                        <option value="Classification (Odd One Out)">Classification (Odd One Out)</option>
                        <option value="Analogy (Word/Number)">Analogy (Word/Number)</option>
                    </select>'''
    
    topic_select_replace = topic_select_search + '''
                    <label for="difficulty-select">Select Difficulty:</label>
                    <select id="difficulty-select" class="dropdown" style="width: 100%; margin-bottom: 20px;">
                        <option value="All">All Difficulties</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>'''
    html = html.replace(topic_select_search, topic_select_replace)

    diag_res_search = '''            <div id="topic-results" style="margin-top: 20px;">
                <!-- Dynamically populated -->
            </div>'''
    diag_res_replace = '''            <div id="topic-results" style="margin-top: 20px;">
                <!-- Dynamically populated -->
            </div>
            <div id="difficulty-results" style="margin-top: 20px;"></div>'''
    html = html.replace(diag_res_search, diag_res_replace)

    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)


if __name__ == '__main__':
    update_app_js()
    update_index()
