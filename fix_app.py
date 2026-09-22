import re

with open('js/app.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Find everything from '// Progress Screen Logic' to the end
idx = text.find('// Progress Screen Logic')
if idx != -1:
    text = text[:idx]

correct_js = """// Progress Screen Logic
function showProgressScreen() {
    const history = getSavedHistory() || {};
    const diags = history.diagnostics || [];
    const drills = history.drills || [];
    
    const content = document.getElementById('progress-content');
    
    if (diags.length === 0) {
        content.innerHTML = '<div class="empty-state" style="text-align: center; padding: 40px 20px;">' +
            '<h3 style="margin-bottom: 15px;">No progress yet</h3>' +
            '<p style="color: var(--text-muted);">Complete your first diagnostic to start tracking your progress.</p>' +
            '</div>';
        switchScreen('progress');
        return;
    }
    
    let bestDiag = 0;
    diags.forEach(d => { if(d.accuracy > bestDiag) bestDiag = d.accuracy; });
    
    let bestDrill = 0;
    drills.forEach(d => { if(d.accuracy > bestDrill) bestDrill = d.accuracy; });
    
    let html = `
        <div class="progress-summary">
            <div class="progress-stat-card">
                <h4>Diagnostics Completed</h4>
                <p>${diags.length}</p>
            </div>
            <div class="progress-stat-card">
                <h4>Drills Completed</h4>
                <p>${drills.length}</p>
            </div>
            <div class="progress-stat-card">
                <h4>Diagnostic Accuracy</h4>
                <p style="font-size: 0.9rem; margin-top: 5px;">Latest: ${diags[0].accuracy}%</p>
                <p style="font-size: 0.9rem; color: var(--text-muted);">Best: ${bestDiag}%</p>
            </div>
            <div class="progress-stat-card">
                <h4>Drill Accuracy</h4>
                <p style="font-size: 0.9rem; margin-top: 5px;">Latest: ${drills.length > 0 ? drills[0].accuracy + '%' : 'N/A'}</p>
                <p style="font-size: 0.9rem; color: var(--text-muted);">Best: ${drills.length > 0 ? bestDrill + '%' : 'N/A'}</p>
            </div>
        </div>
        
        <h3>Topic Progress</h3>
    `;
    
    // Topic performance logic
    const topics = [
        'Blood Relations', 'Coded Language', 'Dictionary Order', 
        'Letter-cluster Analogy / Series', 'Mathematical Operations', 'Syllogism'
    ];
    
    html += '<div class="progress-table-container"><table class="progress-table"><thead><tr><th>Topic</th><th>Latest</th><th>Best</th><th>Status</th><th>Drills</th></tr></thead><tbody>';
    
    topics.forEach(t => {
        const allAccs = [];
        const topicDiags = diags.map(d => d.topicPerformance[t]).filter(Boolean).reverse();
        topicDiags.forEach(td => { if(td.attempted > 0) allAccs.push(td.accuracy); });
        
        const topicDrills = drills.filter(d => d.topic === t).reverse();
        topicDrills.forEach(td => allAccs.push(td.accuracy));
        
        let drillsCompleted = topicDrills.length;
        
        if (allAccs.length > 0) {
            const latest = allAccs[allAccs.length - 1];
            const best = Math.max(...allAccs);
            
            let statusHTML = '<span class="change-neutral">No Change</span>';
            if (allAccs.length >= 2) {
                const prev = allAccs[allAccs.length - 2];
                if (latest > prev) {
                    statusHTML = '<span class="change-positive">Improved</span>';
                } else if (latest < prev) {
                    statusHTML = '<span class="change-negative">Needs More Practice</span>';
                }
            } else {
                statusHTML = '<span class="change-neutral">-</span>';
            }
            
            html += `<tr>
                <td>${t}</td>
                <td>${latest}%</td>
                <td>${best}%</td>
                <td>${statusHTML}</td>
                <td>${drillsCompleted}</td>
            </tr>`;
        }
    });
    
    html += '</tbody></table></div>';
    
    if (drills.length === 0) {
        html += '<p style="text-align: center; color: var(--text-muted); margin-bottom: 30px;">No drills completed yet.</p>';
    } else {
        html += '<h3>Recent Drills</h3><div class="progress-table-container"><table class="progress-table"><thead><tr><th>Topic</th><th>Date</th><th>Score</th><th>Accuracy</th><th>Change</th></tr></thead><tbody>';
        drills.slice(0, 5).forEach(d => {
            const dateStr = new Date(d.timestamp).toLocaleString();
            const sign = d.change > 0 ? '+' : '';
            html += `<tr>
                <td>${d.topic}</td>
                <td>${dateStr}</td>
                <td>${d.score}/${d.attempted}</td>
                <td>${d.accuracy}%</td>
                <td>${sign}${d.change} pp</td>
            </tr>`;
        });
        html += '</tbody></table></div>';
    }
    
    html += '<h3>Recent Diagnostics</h3><div class="progress-table-container"><table class="progress-table"><thead><tr><th>Date</th><th>Score</th><th>Accuracy</th></tr></thead><tbody>';
    diags.slice(0, 5).forEach(d => {
        const dateStr = new Date(d.timestamp).toLocaleString();
        html += `<tr>
            <td>${dateStr}</td>
            <td>${d.score}/${d.attempted}</td>
            <td>${d.accuracy}%</td>
        </tr>`;
    });
    html += '</tbody></table></div>';
    
    content.innerHTML = html;
    switchScreen('progress');
}

function resetProgress() {
    if(confirm("Reset all progress history? This cannot be undone.")) {
        localStorage.removeItem(STORAGE_KEY);
        checkHistory(); // Updates home screen history section
        showProgressScreen();
    }
}
"""

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(text + correct_js)

print("Fixed app.js")
