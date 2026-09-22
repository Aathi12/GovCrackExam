def inject_body():
    with open('js/app.js', 'r', encoding='utf-8') as f:
        js = f.read()

    func_inject = '''
function updateQuestionHistory(quiz, answers, mode) {
    const history = getSavedHistory() || {};
    if (!history.questionHistory) history.questionHistory = {};
    
    const now = new Date().toISOString();
    
    quiz.forEach(q => {
        // Skip unanswered
        if (!answers[q.qid]) return;
        
        if (!history.questionHistory[q.qid]) {
            history.questionHistory[q.qid] = {
                attempts: 0,
                correct: 0,
                incorrect: 0,
                accuracy: 0,
                lastAttemptAt: null,
                lastResult: null,
                currentStreak: 0,
                bestStreak: 0
            };
        }
        
        let qh = history.questionHistory[q.qid];
        let isCorrect = answers[q.qid] === q.correctOption;
        
        qh.attempts++;
        if (isCorrect) {
            qh.correct++;
            qh.currentStreak++;
            if (qh.currentStreak > qh.bestStreak) qh.bestStreak = qh.currentStreak;
            qh.lastResult = 'correct';
        } else {
            qh.incorrect++;
            qh.currentStreak = 0;
            qh.lastResult = 'incorrect';
        }
        
        qh.accuracy = Math.round((qh.correct / qh.attempts) * 100);
        qh.lastAttemptAt = now;
    });
    
    saveHistory(history);
}

function renderQuestionReview() {
    const container = document.getElementById('qr-results-container');
    if (!container) return;
    
    const history = getSavedHistory() || {};
    const qh = history.questionHistory || {};
    
    if (Object.keys(qh).length === 0) {
        container.innerHTML = '<div style="padding: 15px; text-align: center; color: var(--text-muted); background: var(--card-bg); border-radius: 6px; border: 1px solid var(--border-color);">Answer some practice questions to build your question history.</div>';
        return;
    }
    
    const statusFilter = document.getElementById('qr-status-filter').value;
    const topicFilter = document.getElementById('qr-topic-filter').value;
    const diffFilter = document.getElementById('qr-diff-filter').value;
    
    let results = [];
    questionsBank.forEach(q => {
        if (qh[q.qid]) {
            const h = qh[q.qid];
            
            // Determine Status
            let status = 'None';
            if (h.attempts >= 3 && h.accuracy >= 80 && h.currentStreak >= 2) {
                status = 'Mastered';
            } else if (h.attempts >= 2 && h.accuracy < 50) {
                status = 'Needs Practice';
            } else if (h.incorrect >= 2) {
                status = 'Frequently Missed';
            } else if (h.lastResult === 'correct' && h.incorrect > 0 && h.attempts >= 2) {
                status = 'Improving';
            }
            
            let passStatus = statusFilter === 'All' || status === statusFilter;
            let passTopic = topicFilter === 'All' || q.subtopic === topicFilter;
            let passDiff = diffFilter === 'All' || (q.difficulty || 'Medium') === diffFilter;
            
            if (passStatus && passTopic && passDiff) {
                results.push({ q: q, h: h, status: status });
            }
        }
    });
    
    if (results.length === 0) {
        container.innerHTML = '<div style="padding: 15px; text-align: center; color: var(--text-muted); background: var(--card-bg); border-radius: 6px; border: 1px solid var(--border-color);">No questions match these filters yet.</div>';
        return;
    }
    
    // Sort by most recently attempted
    results.sort((a, b) => new Date(b.h.lastAttemptAt) - new Date(a.h.lastAttemptAt));
    
    let html = '';
    results.forEach(item => {
        const h = item.h;
        const q = item.q;
        const diff = q.difficulty || 'Medium';
        const color = diff === 'Easy' ? '#10b981' : (diff === 'Hard' ? '#ef4444' : '#f59e0b');
        
        let statusBadge = '';
        if (item.status !== 'None') {
            statusBadge = `<span style="font-size: 0.7rem; padding: 2px 5px; border-radius: 3px; background: rgba(255,255,255,0.1); margin-left: 5px;">${item.status}</span>`;
        }
        
        html += `
        <div class="card" style="padding: 15px; border-left: 3px solid ${color};">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                <div style="font-size: 0.85rem; color: var(--text-muted);">${q.subtopic} ${statusBadge}</div>
                <div style="font-size: 0.8rem;">Acc: ${h.accuracy}% (${h.correct}/${h.attempts})</div>
            </div>
            <p style="font-size: 0.95rem; margin-bottom: 15px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${escapeHTML(q.question)}</p>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="font-size: 0.8rem; color: ${h.lastResult === 'correct' ? 'var(--success-color)' : 'var(--danger-color)'};">
                    Last: ${h.lastResult}
                </div>
                <button class="secondary-btn" style="padding: 5px 10px; font-size: 0.8rem;" onclick="openQuestionReviewModal('${q.qid}')">Review Question</button>
            </div>
        </div>`;
    });
    
    container.innerHTML = html;
}

window.openQuestionReviewModal = function(qid) {
    const q = questionsBank.find(x => x.qid === qid);
    if (!q) return;
    
    const history = getSavedHistory() || {};
    const h = (history.questionHistory && history.questionHistory[qid]) ? history.questionHistory[qid] : null;
    
    const modal = document.getElementById('qr-modal');
    const content = document.getElementById('qr-modal-content');
    
    let hHtml = '';
    if (h) {
        hHtml = `
        <div style="display: flex; gap: 10px; margin-bottom: 20px; background: rgba(255,255,255,0.02); padding: 10px; border-radius: 6px;">
            <div style="flex: 1; text-align: center;">
                <div style="font-size: 1.1rem; font-weight: bold;">${h.attempts}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">Attempts</div>
            </div>
            <div style="flex: 1; text-align: center;">
                <div style="font-size: 1.1rem; font-weight: bold; color: var(--success-color);">${h.accuracy}%</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">Accuracy</div>
            </div>
            <div style="flex: 1; text-align: center;">
                <div style="font-size: 1.1rem; font-weight: bold;">${h.currentStreak}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">Current Streak</div>
            </div>
        </div>`;
    }
    
    let optHtml = q.options.map((opt, i) => `
        <div style="padding: 8px 12px; margin-bottom: 5px; border: 1px solid ${i+1 === q.correctOption ? 'var(--success-color)' : 'var(--border-color)'}; border-radius: 4px; background: ${i+1 === q.correctOption ? 'rgba(16, 185, 129, 0.1)' : 'transparent'};">
            ${i+1}. ${escapeHTML(opt)}
            ${i+1 === q.correctOption ? '<span style="float: right; color: var(--success-color); font-size: 0.8rem; margin-top: 3px;">Correct Answer</span>' : ''}
        </div>
    `).join('');
    
    content.innerHTML = `
        <div style="margin-bottom: 10px;">
            <span style="font-size: 0.8rem; padding: 2px 6px; background: var(--primary-color); color: white; border-radius: 4px;">${q.subtopic}</span>
            <span style="font-size: 0.8rem; padding: 2px 6px; background: var(--border-color); color: white; border-radius: 4px; margin-left: 5px;">${q.difficulty || 'Medium'}</span>
        </div>
        ${hHtml}
        <p style="font-weight: 600; margin-bottom: 15px;">${escapeHTML(q.question)}</p>
        <div style="margin-bottom: 20px;">
            ${optHtml}
        </div>
        <div class="explanation-card" style="padding-top: 15px; border-top: 1px solid var(--border-color);">
            <strong>Explanation:</strong><br>${escapeHTML(q.explanation).replace(/\\n/g, '<br>')}
        </div>
    `;
    
    modal.classList.remove('hidden');
};
'''
    if 'function updateQuestionHistory(quiz, answers, mode)' not in js:
        js += func_inject
        with open('js/app.js', 'w', encoding='utf-8') as f:
            f.write(js)

if __name__ == '__main__':
    inject_body()
