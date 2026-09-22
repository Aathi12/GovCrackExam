import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Add report button
report_btn_html = """
            <div style="text-align: right; margin-bottom: 15px;">
                <button id="report-issue-btn" class="secondary-btn hidden" style="font-size: 0.8rem; padding: 5px 10px; border-color: transparent; text-decoration: underline; background: none; color: var(--text-muted);">Report an Issue</button>
            </div>
"""
html = html.replace('<!-- Drill Feedback (only shown in drill mode) -->', report_btn_html + '            <!-- Drill Feedback (only shown in drill mode) -->')

# Add feedback management section
feedback_management_html = """
            <div id="feedback-management-section" style="margin-top: 30px; background: var(--bg-main); padding: 15px; border-radius: 8px; border: 1px solid var(--border-color);">
                <h3 style="margin-bottom: 10px;">Question Feedback</h3>
                <p style="margin-bottom: 10px; font-size: 0.9rem;">Reports Saved: <strong id="feedback-count">0</strong></p>
                <p id="no-feedback-msg" style="margin-bottom: 15px; font-size: 0.9rem; color: var(--text-muted); display: none;">No question feedback has been saved on this device.</p>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <button id="export-feedback-btn" class="secondary-btn" style="flex: 1; font-size: 0.9rem;">Export Feedback</button>
                    <button id="clear-feedback-btn" class="danger-btn" style="flex: 1; font-size: 0.9rem;">Clear Feedback</button>
                </div>
                <p style="margin-top: 10px; font-size: 0.8rem; color: var(--text-muted);">Feedback is stored only in this browser until exported or cleared.</p>
            </div>
"""
html = html.replace('<div class="actions" style="margin-top: 30px; display: flex; flex-direction: column; gap: 10px;">',
                    feedback_management_html + '            <div class="actions" style="margin-top: 30px; display: flex; flex-direction: column; gap: 10px;">')

# Add Report Modal
report_modal_html = """
    <!-- Report Issue Modal -->
    <div id="report-issue-modal" class="modal hidden">
        <div class="modal-content card" style="max-width: 400px; text-align: left;">
            <h3 style="margin-bottom: 15px; color: var(--primary-color);">Report an Issue</h3>
            <p style="margin-bottom: 15px; font-size: 0.9rem; color: var(--text-muted);">Question Ref: <span id="report-qid-display"></span></p>
            
            <div style="margin-bottom: 15px;">
                <label for="issue-type" style="display: block; margin-bottom: 5px; font-weight: bold; font-size: 0.95rem;">Issue Type:</label>
                <select id="issue-type" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid var(--border-color); font-size: 1rem;">
                    <option value="Wrong answer">Wrong answer</option>
                    <option value="Wrong explanation">Wrong explanation</option>
                    <option value="Question unclear">Question unclear</option>
                    <option value="Options problem">Options problem</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            
            <div style="margin-bottom: 20px;">
                <label for="issue-details" style="display: block; margin-bottom: 5px; font-weight: bold; font-size: 0.95rem;">Additional details (optional):</label>
                <textarea id="issue-details" rows="3" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid var(--border-color); resize: vertical; box-sizing: border-box; font-size: 1rem;"></textarea>
            </div>
            
            <div class="actions" style="display: flex; gap: 10px;">
                <button id="report-cancel-btn" class="secondary-btn" style="flex: 1;">Cancel</button>
                <button id="report-submit-btn" class="primary-btn" style="flex: 1;">Submit Report</button>
            </div>
        </div>
    </div>
"""

# Insert modal before closing body tag
html = html.replace('</body>', report_modal_html + '\n</body>')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated index.html")
