import re

with open('js/app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

# 1. New elements
new_elements = """const exportFeedbackBtn = document.getElementById('export-feedback-btn');
const clearFeedbackBtn = document.getElementById('clear-feedback-btn');

// Feedback Review Elements
const frTotalReports = document.getElementById('fr-total-reports');
const frQuestionsReported = document.getElementById('fr-questions-reported');
const frMostReported = document.getElementById('fr-most-reported');
const frMostCommon = document.getElementById('fr-most-common');
const frNoFeedbackMsg = document.getElementById('fr-no-feedback-msg');
const feedbackReviewList = document.getElementById('feedback-review-list');
const exportReviewBtn = document.getElementById('export-review-btn');
const clearReviewBtn = document.getElementById('clear-review-btn');

const reviewModal = document.getElementById('review-question-modal');
const revCloseIcon = document.getElementById('review-close-icon');
const revCancelBtn = document.getElementById('rev-cancel-btn');
const revMarkReviewedBtn = document.getElementById('rev-mark-reviewed-btn');
const revDismissBtn = document.getElementById('rev-dismiss-btn');
const revQid = document.getElementById('rev-qid');
const revTopic = document.getElementById('rev-topic');
const revQuestionText = document.getElementById('rev-question-text');
const revOptions = document.getElementById('rev-options');
const revCorrect = document.getElementById('rev-correct');
const revExplanation = document.getElementById('rev-explanation');
const revFeedbackList = document.getElementById('rev-feedback-list');

let currentReviewQid = null;
"""
app_js = app_js.replace("""const exportFeedbackBtn = document.getElementById('export-feedback-btn');
const clearFeedbackBtn = document.getElementById('clear-feedback-btn');""", new_elements)

# 2. Event listeners
new_listeners = """        if (clearFeedbackBtn) clearFeedbackBtn.addEventListener('click', clearStoredFeedback);
        
        // Feedback Review Listeners
        if (exportReviewBtn) exportReviewBtn.addEventListener('click', exportReviewData);
        if (clearReviewBtn) clearReviewBtn.addEventListener('click', clearReviewStatus);
        
        if (revCloseIcon) revCloseIcon.addEventListener('click', () => reviewModal.classList.add('hidden'));
        if (revCancelBtn) revCancelBtn.addEventListener('click', () => reviewModal.classList.add('hidden'));
        if (revMarkReviewedBtn) revMarkReviewedBtn.addEventListener('click', () => updateReviewStatus('reviewed'));
        if (revDismissBtn) revDismissBtn.addEventListener('click', () => updateReviewStatus('dismissed'));

        // Close modal on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (reportModal && !reportModal.classList.contains('hidden')) {
                    reportModal.classList.add('hidden');
                }
                if (reviewModal && !reviewModal.classList.contains('hidden')) {
                    reviewModal.classList.add('hidden');
                }
            }
        });
"""
app_js = app_js.replace("""        if (clearFeedbackBtn) clearFeedbackBtn.addEventListener('click', clearStoredFeedback);
        
        // Close modal on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && reportModal && !reportModal.classList.contains('hidden')) {
                reportModal.classList.add('hidden');
            }
        });""", new_listeners)

# 3. showProgressScreen integration
progress_insert = """    if (noFeedbackMsg) {
        if (feedbacks.length === 0) {
            noFeedbackMsg.style.display = 'block';
        } else {
            noFeedbackMsg.style.display = 'none';
        }
    }
    
    renderFeedbackReviewSection(feedbacks);
"""
app_js = app_js.replace("""    if (noFeedbackMsg) {
        if (feedbacks.length === 0) {
            noFeedbackMsg.style.display = 'block';
        } else {
            noFeedbackMsg.style.display = 'none';
        }
    }""", progress_insert)


# 4. Review Logic
review_logic = """
// ==========================================
// FEEDBACK REVIEW LOGIC
// ==========================================

function getReviewStatuses() {
    const raw = localStorage.getItem('govcrackexam-feedback-review-v1');
    if (!raw) return {};
    try {
        return JSON.parse(raw);
    } catch (e) {
        return {};
    }
}

function saveReviewStatuses(statuses) {
    localStorage.setItem('govcrackexam-feedback-review-v1', JSON.stringify(statuses));
}

function renderFeedbackReviewSection(feedbacks) {
    if (!feedbackReviewList) return;
    
    feedbackReviewList.innerHTML = '';
    
    if (feedbacks.length === 0) {
        if(frNoFeedbackMsg) frNoFeedbackMsg.style.display = 'block';
        if(document.getElementById('feedback-review-stats')) document.getElementById('feedback-review-stats').style.display = 'none';
        return;
    }
    
    if(frNoFeedbackMsg) frNoFeedbackMsg.style.display = 'none';
    if(document.getElementById('feedback-review-stats')) document.getElementById('feedback-review-stats').style.display = 'block';

    const groups = {};
    const issueCounts = {};
    
    feedbacks.forEach(fb => {
        if (!groups[fb.questionId]) {
            groups[fb.questionId] = {
                questionId: fb.questionId,
                reports: [],
                newest: fb.timestamp
            };
        }
        groups[fb.questionId].reports.push(fb);
        if (fb.timestamp > groups[fb.questionId].newest) {
            groups[fb.questionId].newest = fb.timestamp;
        }
        
        issueCounts[fb.issueType] = (issueCounts[fb.issueType] || 0) + 1;
    });
    
    const statuses = getReviewStatuses();
    
    const groupArray = Object.values(groups);
    
    // Sort: Needs Review first, then report count desc
    groupArray.sort((a, b) => {
        const statusA = (statuses[a.questionId] && statuses[a.questionId].status) || 'needs-review';
        const statusB = (statuses[b.questionId] && statuses[b.questionId].status) || 'needs-review';
        
        if (statusA === 'needs-review' && statusB !== 'needs-review') return -1;
        if (statusA !== 'needs-review' && statusB === 'needs-review') return 1;
        
        if (b.reports.length !== a.reports.length) {
            return b.reports.length - a.reports.length;
        }
        return b.newest > a.newest ? 1 : -1;
    });
    
    // Stats
    let mostReportedId = '-';
    let maxReports = 0;
    groupArray.forEach(g => {
        if (g.reports.length > maxReports) {
            maxReports = g.reports.length;
            mostReportedId = 'Q-' + g.questionId.substring(0,8);
        }
    });
    
    let mostCommon = '-';
    let maxIssueCount = 0;
    for (const [issue, count] of Object.entries(issueCounts)) {
        if (count > maxIssueCount) {
            maxIssueCount = count;
            mostCommon = issue;
        }
    }
    
    if(frTotalReports) frTotalReports.textContent = feedbacks.length;
    if(frQuestionsReported) frQuestionsReported.textContent = groupArray.length;
    if(frMostReported) frMostReported.textContent = mostReportedId;
    if(frMostCommon) frMostCommon.textContent = mostCommon;
    
    groupArray.forEach(g => {
        const qRecord = questionsBank.find(q => q.qid === g.questionId);
        const topic = qRecord ? qRecord.subtopic : 'Unknown';
        const statusObj = statuses[g.questionId] || { status: 'needs-review' };
        
        const card = document.createElement('div');
        card.style.cssText = 'background: var(--bg-card); padding: 15px; border-radius: 8px; border: 1px solid var(--border-color);';
        
        const statusLabel = statusObj.status === 'needs-review' ? 'Needs Review' : (statusObj.status === 'reviewed' ? 'Reviewed' : 'Dismissed');
        const statusColor = statusObj.status === 'needs-review' ? '#eab308' : (statusObj.status === 'reviewed' ? '#22c55e' : 'var(--text-muted)');
        
        const issuesList = [...new Set(g.reports.map(r => r.issueType))].join(', ');
        
        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; flex-wrap: wrap; gap: 10px;">
                <div>
                    <h4 style="margin-bottom: 5px;">Question: Q-${g.questionId.substring(0,8)}</h4>
                    <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 5px;">${topic}</p>
                </div>
                <div style="text-align: right;">
                    <span style="display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: bold; background: ${statusColor}20; color: ${statusColor};">${statusLabel}</span>
                </div>
            </div>
            <p style="font-size: 0.9rem; margin-bottom: 5px;"><strong>Reports:</strong> ${g.reports.length}</p>
            <p style="font-size: 0.9rem; margin-bottom: 15px;"><strong>Issues:</strong> ${issuesList}</p>
            <button class="secondary-btn review-btn" data-qid="${g.questionId}" style="font-size: 0.85rem; padding: 5px 10px;">Review Question</button>
        `;
        
        const btn = card.querySelector('.review-btn');
        btn.addEventListener('click', () => openReviewModal(g.questionId, g.reports));
        
        feedbackReviewList.appendChild(card);
    });
}

function openReviewModal(qid, reports) {
    currentReviewQid = qid;
    const q = questionsBank.find(x => x.qid === qid);
    
    if (!q) {
        alert("Question data not found.");
        return;
    }
    
    revQid.textContent = q.qid;
    revTopic.textContent = q.subtopic;
    
    // Safely render question
    revQuestionText.innerHTML = '';
    const p = document.createElement('p');
    p.textContent = q.question;
    revQuestionText.appendChild(p);
    
    // Render options
    revOptions.innerHTML = '';
    q.options.forEach((opt, idx) => {
        const div = document.createElement('div');
        div.style.cssText = 'padding: 5px; margin-bottom: 5px; background: var(--bg-main); border-radius: 4px; font-size: 0.9rem;';
        div.textContent = `${idx + 1}. ${opt}`;
        revOptions.appendChild(div);
    });
    
    revCorrect.textContent = `Option ${q.correctOption}`;
    revExplanation.textContent = q.explanation;
    
    // Render user feedback
    revFeedbackList.innerHTML = '';
    reports.forEach(r => {
        const fDiv = document.createElement('div');
        fDiv.style.cssText = 'background: var(--bg-card); padding: 10px; border-radius: 6px; border: 1px dashed var(--border-color);';
        
        const dateStr = new Date(r.timestamp).toLocaleString();
        const typeEl = document.createElement('p');
        typeEl.style.cssText = 'font-weight: bold; font-size: 0.9rem; margin-bottom: 5px; color: var(--primary-color);';
        typeEl.textContent = `${r.issueType} (${dateStr}) - ${r.mode}`;
        fDiv.appendChild(typeEl);
        
        if (r.details) {
            const detEl = document.createElement('p');
            detEl.style.cssText = 'font-size: 0.9rem; margin-top: 5px; color: var(--text-color); white-space: pre-wrap;';
            detEl.textContent = `Details: ${r.details}`;
            fDiv.appendChild(detEl);
        }
        
        revFeedbackList.appendChild(fDiv);
    });
    
    reviewModal.classList.remove('hidden');
}

function updateReviewStatus(status) {
    if (!currentReviewQid) return;
    
    const statuses = getReviewStatuses();
    statuses[currentReviewQid] = {
        questionId: currentReviewQid,
        status: status,
        reviewedAt: new Date().toISOString()
    };
    
    saveReviewStatuses(statuses);
    
    reviewModal.classList.add('hidden');
    showProgressScreen(); // refresh list
}

function exportReviewData() {
    const statuses = getReviewStatuses();
    const feedbacks = getSavedFeedback();
    
    const exportData = {
        statuses: statuses,
        feedbackSnapshot: feedbacks
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "govcrackexam-feedback-review.json");
    dlAnchorElem.click();
}

function clearReviewStatus() {
    const statuses = getReviewStatuses();
    if (Object.keys(statuses).length === 0) return;
    
    if (confirm("Clear all review statuses? This will NOT delete the original feedback reports.")) {
        localStorage.removeItem('govcrackexam-feedback-review-v1');
        showProgressScreen();
    }
}
"""
app_js = app_js + "\n" + review_logic

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(app_js)
print("Updated js/app.js")
