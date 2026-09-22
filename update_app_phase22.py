import re

with open('js/app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

# 1. UI elements injection
ui_elements = """const confirmModal = document.getElementById('submit-confirm-modal');
const confirmContinueBtn = document.getElementById('confirm-continue-btn');
const confirmSubmitBtn = document.getElementById('confirm-submit-btn');

// Feedback Elements
const reportIssueBtn = document.getElementById('report-issue-btn');
const reportModal = document.getElementById('report-issue-modal');
const reportQidDisplay = document.getElementById('report-qid-display');
const issueType = document.getElementById('issue-type');
const issueDetails = document.getElementById('issue-details');
const reportCancelBtn = document.getElementById('report-cancel-btn');
const reportSubmitBtn = document.getElementById('report-submit-btn');
const feedbackCount = document.getElementById('feedback-count');
const noFeedbackMsg = document.getElementById('no-feedback-msg');
const exportFeedbackBtn = document.getElementById('export-feedback-btn');
const clearFeedbackBtn = document.getElementById('clear-feedback-btn');
"""
app_js = app_js.replace("const confirmModal = document.getElementById('submit-confirm-modal');\nconst confirmContinueBtn = document.getElementById('confirm-continue-btn');\nconst confirmSubmitBtn = document.getElementById('confirm-submit-btn');", ui_elements)

# 2. Event Listeners
event_listeners = """        if(confirmSubmitBtn) confirmSubmitBtn.addEventListener('click', () => {
            confirmModal.classList.add('hidden');
            calculateFullPracticeResults();
            switchScreen('fullPracticeResults');
        });
        
        // Feedback Listeners
        if (reportIssueBtn) reportIssueBtn.addEventListener('click', openReportModal);
        if (reportCancelBtn) reportCancelBtn.addEventListener('click', () => reportModal.classList.add('hidden'));
        if (reportSubmitBtn) reportSubmitBtn.addEventListener('click', submitReport);
        if (exportFeedbackBtn) exportFeedbackBtn.addEventListener('click', exportFeedback);
        if (clearFeedbackBtn) clearFeedbackBtn.addEventListener('click', clearStoredFeedback);
        
        // Close modal on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && reportModal && !reportModal.classList.contains('hidden')) {
                reportModal.classList.add('hidden');
            }
        });
"""
app_js = app_js.replace("""        if(confirmSubmitBtn) confirmSubmitBtn.addEventListener('click', () => {
            confirmModal.classList.add('hidden');
            calculateFullPracticeResults();
            switchScreen('fullPracticeResults');
        });""", event_listeners)

# 3. renderQuestion integration
render_q_insert = """
    if (prevBtn) prevBtn.disabled = currentQuestionIndex === 0;

    // Feedback button visibility
    if (reportIssueBtn) {
        if (mode === 'diagnostic') {
            reportIssueBtn.classList.add('hidden');
        } else {
            reportIssueBtn.classList.remove('hidden');
        }
    }
"""
app_js = app_js.replace("    if (prevBtn) prevBtn.disabled = currentQuestionIndex === 0;", render_q_insert)

# 4. showProgressScreen integration
progress_insert = """    if (drills.length === 0) {
        document.getElementById('drill-stats-container').style.display = 'none';
    } else {
        document.getElementById('drill-stats-container').style.display = 'grid';
    }

    // Load Feedback Stats
    const feedbacks = getSavedFeedback();
    if (feedbackCount) feedbackCount.textContent = feedbacks.length;
    if (noFeedbackMsg) {
        if (feedbacks.length === 0) {
            noFeedbackMsg.style.display = 'block';
        } else {
            noFeedbackMsg.style.display = 'none';
        }
    }
"""
app_js = app_js.replace("""    if (drills.length === 0) {
        document.getElementById('drill-stats-container').style.display = 'none';
    } else {
        document.getElementById('drill-stats-container').style.display = 'grid';
    }""", progress_insert)


# 5. Feedback Functions
feedback_funcs = """
// ==========================================
// FEEDBACK LOGIC
// ==========================================

function getSavedFeedback() {
    const raw = localStorage.getItem('govcrackexam-feedback-v1');
    if (!raw) return [];
    try {
        return JSON.parse(raw);
    } catch (e) {
        return [];
    }
}

function openReportModal() {
    const q = currentQuiz[currentQuestionIndex];
    if (!q) return;
    const shortId = q.qid.substring(0, 8);
    reportQidDisplay.textContent = 'Q-' + shortId;
    issueType.value = 'Wrong answer';
    issueDetails.value = '';
    reportModal.classList.remove('hidden');
}

function submitReport() {
    const q = currentQuiz[currentQuestionIndex];
    if (!q) return;
    
    reportSubmitBtn.disabled = true;
    reportSubmitBtn.textContent = 'Saving...';
    
    setTimeout(() => {
        const feedbacks = getSavedFeedback();
        
        const newFeedback = {
            id: 'fb-' + Math.random().toString(36).substr(2, 9),
            timestamp: new Date().toISOString(),
            questionId: q.qid,
            mode: mode,
            issueType: issueType.value,
            details: issueDetails.value.trim()
        };
        
        feedbacks.unshift(newFeedback);
        
        // Limit to 100
        if (feedbacks.length > 100) {
            feedbacks.pop();
        }
        
        localStorage.setItem('govcrackexam-feedback-v1', JSON.stringify(feedbacks));
        
        alert("Thanks. Your feedback has been saved on this device.");
        
        reportSubmitBtn.disabled = false;
        reportSubmitBtn.textContent = 'Submit Report';
        reportModal.classList.add('hidden');
    }, 300); // slight delay to prevent double-clicks
}

function exportFeedback() {
    const feedbacks = getSavedFeedback();
    if (feedbacks.length === 0) {
        alert("No feedback to export.");
        return;
    }
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(feedbacks, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "govcrackexam-feedback.json");
    dlAnchorElem.click();
}

function clearStoredFeedback() {
    const feedbacks = getSavedFeedback();
    if (feedbacks.length === 0) return;
    
    if (confirm("Clear all saved question feedback from this browser?")) {
        localStorage.removeItem('govcrackexam-feedback-v1');
        showProgressScreen(); // Refresh the progress UI
    }
}
"""
app_js = app_js + "\n" + feedback_funcs

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(app_js)
print("Updated js/app.js")
