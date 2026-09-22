import re

def main():
    # 1. Update index.html
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # Add difficulty selector to Topic Practice configuration
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

    # Add difficulty section to Diagnostic Results
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

    # 2. Update app.js
    with open('js/app.js', 'r', encoding='utf-8') as f:
        js = f.read()
        
    # Topic Practice - reading difficulty
    start_tp_search = '''function startTopicPractice(topic) {'''
    start_tp_replace = '''function startTopicPractice(topic) {
    const diffSelect = document.getElementById('difficulty-select');
    const difficultyFilter = diffSelect ? diffSelect.value : 'All';'''
    js = js.replace(start_tp_search, start_tp_replace)
    
    # Topic Practice filtering
    tp_filter_search = '''    let eligibleQuestions = questions.filter(q => q.subtopic === topic);'''
    tp_filter_replace = '''    let eligibleQuestions = questions.filter(q => q.subtopic === topic);
    if (difficultyFilter !== 'All') {
        eligibleQuestions = eligibleQuestions.filter(q => (q.difficulty || 'Medium') === difficultyFilter);
    }
    
    if (eligibleQuestions.length === 0) {
        alert("No questions found for the selected combination.");
        return;
    }'''
    js = js.replace(tp_filter_search, tp_filter_replace)

    # renderResultsScreen appending difficulty html
    render_res_search = '''    const reviewContainer = document.getElementById('diagnostic-review');'''
    render_res_replace = '''
    const diffContainer = document.getElementById('difficulty-results');
    if (diffContainer && results.difficultyPerformance) {
        let dh = '<h3>Difficulty Performance</h3><div style="display:flex; gap:10px; margin-top:10px;">';
        ['Easy', 'Medium', 'Hard'].forEach(lvl => {
            if (results.difficultyPerformance[lvl]) {
                const d = results.difficultyPerformance[lvl];
                dh += `<div class="card" style="flex:1; text-align:center;">
                    <div style="font-weight:bold; margin-bottom:5px;">${lvl}</div>
                    <div>${d.correct} / ${d.attempted}</div>
                    <div>${d.accuracy}%</div>
                </div>`;
            }
        });
        dh += '</div>';
        diffContainer.innerHTML = dh;
    }
    const reviewContainer = document.getElementById('diagnostic-review');'''
    js = js.replace(render_res_search, render_res_replace)

    # showProgressScreen logic - aggregate difficulty across history
    prog_search = '''    if (diags.length === 0 && drills.length === 0 && topicPractices.length === 0 && fullPractices.length === 0) {'''
    prog_replace = '''
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
        diffHtml = '<div class="card" style="margin-bottom: 20px;"><h3 style="margin-bottom:10px;">Overall Difficulty Performance</h3><div style="display:flex; gap:10px; flex-wrap:wrap;">';
        for (let lvl of ['Easy', 'Medium', 'Hard']) {
            if (aggDiff[lvl].att > 0) {
                let acc = Math.round((aggDiff[lvl].cor / aggDiff[lvl].att) * 100);
                let color = lvl==='Easy'?'#10b981' : (lvl==='Hard'?'#ef4444' : '#f59e0b');
                diffHtml += `<div style="flex:1; min-width: 100px; text-align:center; padding: 15px; border: 1px solid ${color}; border-radius: 6px; background: rgba(255,255,255,0.02);">
                    <div style="font-weight:bold; color: ${color}; margin-bottom:5px;">${lvl}</div>
                    <div style="font-size:1.2rem; margin-bottom:5px;">${acc}%</div>
                    <div style="font-size:0.8rem; color: var(--text-muted);">${aggDiff[lvl].cor} / ${aggDiff[lvl].att}</div>
                </div>`;
            }
        }
        diffHtml += '</div></div>';
    }

    if (diags.length === 0 && drills.length === 0 && topicPractices.length === 0 && fullPractices.length === 0) {'''
    js = js.replace(prog_search, prog_replace)
    
    # Prepend difficulty html to progress content
    content_search = '''    // Handle Feedback UI'''
    content_replace = '''
    // Prepend difficulty html
    content.innerHTML = diffHtml + content.innerHTML;
    // Handle Feedback UI'''
    js = js.replace(content_search, content_replace)
    
    with open('js/app.js', 'w', encoding='utf-8') as f:
        f.write(js)

if __name__ == '__main__':
    main()
