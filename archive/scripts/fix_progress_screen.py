import re

with open('js/app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

# 1. We will replace switchScreen('progress'); with a function call to handle the feedback UI.
feedback_ui_logic = """    // Handle Feedback UI
    const feedbacks = getSavedFeedback();
    if (typeof feedbackCount !== 'undefined' && feedbackCount) feedbackCount.textContent = feedbacks.length;
    if (typeof noFeedbackMsg !== 'undefined' && noFeedbackMsg) {
        if (feedbacks.length === 0) {
            noFeedbackMsg.style.display = 'block';
        } else {
            noFeedbackMsg.style.display = 'none';
        }
    }
    if (typeof renderFeedbackReviewSection === 'function') {
        renderFeedbackReviewSection(feedbacks);
    }
    switchScreen('progress');"""

app_js = app_js.replace("        switchScreen('progress');\n        return;\n    }",
                        feedback_ui_logic + "\n        return;\n    }")

app_js = app_js.replace("    content.innerHTML = html;\n    switchScreen('progress');",
                        "    content.innerHTML = html;\n" + feedback_ui_logic)

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(app_js)

print("Fixed showProgressScreen in app.js")
