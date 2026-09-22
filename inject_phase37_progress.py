import re
def patch():
    with open('js/app.js', 'r', encoding='utf-8') as f:
        js = f.read()

    js = re.sub(
        r'renderFeedbackReviewSection\(feedbacks\);\s*\}\s*switchScreen\(\'progress\'\);',
        '''renderFeedbackReviewSection(feedbacks);
    }
    
    if (typeof renderQuestionReview === 'function') renderQuestionReview();
    
    let adaptiveCount = 0;
    let adaptiveQuestions = 0;
    drills.forEach(d => {
        if (d.adaptive) {
            adaptiveCount++;
            adaptiveQuestions += d.attempted || 10;
        }
    });
    
    if (adaptiveCount > 0) {
        let adapHtml = `
        <div class="card" style="margin-bottom: 20px;">
            <h3 style="margin-bottom:10px;">Adaptive Drill Summary</h3>
            <div style="display:flex; gap:10px; flex-wrap:wrap;">
                <div style="flex:1; min-width: 100px; text-align:center; padding: 15px; border: 1px solid var(--border-color); border-radius: 6px; background: rgba(255,255,255,0.02);">
                    <div style="font-weight:bold; color: var(--primary-color); margin-bottom:5px;">${adaptiveCount}</div>
                    <div style="font-size:0.9rem;">Drills Completed</div>
                </div>
                <div style="flex:1; min-width: 100px; text-align:center; padding: 15px; border: 1px solid var(--border-color); border-radius: 6px; background: rgba(255,255,255,0.02);">
                    <div style="font-weight:bold; color: var(--primary-color); margin-bottom:5px;">${adaptiveQuestions}</div>
                    <div style="font-size:0.9rem;">Adaptive Questions</div>
                </div>
            </div>
        </div>`;
        const content = document.getElementById('progress-content');
        if (content) {
            content.innerHTML = adapHtml + content.innerHTML;
        }
    }
    switchScreen('progress');''', js)
    with open('js/app.js', 'w', encoding='utf-8') as f:
        f.write(js)

if __name__ == '__main__':
    patch()
