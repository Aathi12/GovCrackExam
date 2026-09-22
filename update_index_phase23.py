import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Remove the duplicated feedback management sections
feedback_section_regex = r'<div id="feedback-management-section"[\s\S]*?</div>\s*<div class="actions"'

# Find all matches
matches = list(re.finditer(feedback_section_regex, html))
# The last one is the one in progress-screen. The others are mistakes.

for m in matches[:-1]:
    html = html.replace(m.group(0), '<div class="actions"')

# 2. Add the Feedback Review Section to the progress screen, immediately following the feedback-management-section
feedback_review_html = """
            <div id="feedback-review-section" style="margin-top: 30px; background: var(--bg-card); padding: 15px; border-radius: 8px; border: 1px solid var(--border-color);">
                <h3 style="margin-bottom: 15px;">Feedback Review</h3>
                <div id="feedback-review-stats" style="margin-bottom: 15px; font-size: 0.9rem; line-height: 1.5;">
                    <p>Total Reports: <strong id="fr-total-reports">0</strong></p>
                    <p>Questions Reported: <strong id="fr-questions-reported">0</strong></p>
                    <p>Most Reported: <strong id="fr-most-reported">-</strong></p>
                    <p>Most Common Issue: <strong id="fr-most-common">-</strong></p>
                </div>
                <p id="fr-no-feedback-msg" style="margin-bottom: 15px; font-size: 0.9rem; color: var(--text-muted); display: none;">No question feedback available for review.</p>
                
                <div id="feedback-review-list" style="display: flex; flex-direction: column; gap: 15px; margin-bottom: 20px;">
                    <!-- Injected via JS -->
                </div>
                
                <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 20px;">
                    <button id="export-review-btn" class="secondary-btn" style="flex: 1; font-size: 0.9rem;">Export Review Data</button>
                    <button id="clear-review-btn" class="danger-btn" style="flex: 1; font-size: 0.9rem;">Clear Review Status</button>
                </div>
            </div>
"""

html = html.replace('<!-- Injected via JS -->\n            </div>\n            <div id="feedback-management-section"',
                    '<!-- Injected via JS -->\n            </div>\n            <div id="feedback-management-section"')

# Actually, I'll place it right after feedback-management-section
html = html.replace('until exported or cleared.</p>\n            </div>',
                    'until exported or cleared.</p>\n            </div>' + '\n' + feedback_review_html)

# 3. Add the Review Question Modal
review_modal_html = """
    <!-- Review Question Modal -->
    <div id="review-question-modal" class="modal hidden">
        <div class="modal-content card" style="max-width: 600px; text-align: left; max-height: 90vh; overflow-y: auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="color: var(--primary-color); margin: 0;">Review Question</h3>
                <button id="review-close-icon" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-muted);">&times;</button>
            </div>
            
            <div style="background: var(--bg-main); padding: 15px; border-radius: 8px; border: 1px solid var(--border-color); margin-bottom: 20px;">
                <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 5px;">Question ID: <span id="rev-qid"></span></p>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 10px;">Topic: <span id="rev-topic"></span></p>
                <div id="rev-question-text" style="margin-bottom: 15px; font-weight: bold; font-size: 1rem;"></div>
                <div id="rev-options" style="margin-bottom: 15px;"></div>
                <p style="margin-bottom: 5px;"><strong>Correct Answer:</strong> <span id="rev-correct"></span></p>
                <p style="margin-bottom: 0;"><strong>Explanation:</strong> <span id="rev-explanation"></span></p>
            </div>

            <h4 style="margin-bottom: 10px; color: var(--primary-color);">User-submitted feedback</h4>
            <div id="rev-feedback-list" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
                <!-- Injected via JS -->
            </div>
            
            <div class="actions" style="display: flex; gap: 10px; flex-wrap: wrap;">
                <button id="rev-mark-reviewed-btn" class="primary-btn" style="flex: 1;">Mark Reviewed</button>
                <button id="rev-dismiss-btn" class="secondary-btn" style="flex: 1;">Dismiss</button>
                <button id="rev-cancel-btn" class="secondary-btn" style="flex: 1;">Close</button>
            </div>
        </div>
    </div>
"""

html = html.replace('</body>', review_modal_html + '\n</body>')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Cleaned up and updated index.html")
