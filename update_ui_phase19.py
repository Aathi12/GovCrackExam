import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

palette_html = """
            <!-- Question Navigation Palette -->
            <div id="quiz-palette-container" class="quiz-palette-container hidden">
                <h4 style="font-size: 0.9rem; margin-bottom: 10px; color: var(--text-muted);">Question Palette</h4>
                <div id="quiz-palette" class="quiz-palette">
                    <!-- Injected via JS -->
                </div>
            </div>
"""

# Insert palette after quiz-header
html = html.replace('<div class="question-container">', palette_html + '            <div class="question-container">')

# Add Mark for review btn
mark_btn = '<button id="mark-review-btn" class="secondary-btn hidden">Mark for Review</button>'
# Put it in quiz-controls. Wait, let's make quiz-controls wrap or have a specific layout.
controls_replace = """<div class="quiz-controls" style="display: flex; flex-wrap: wrap; justify-content: space-between; gap: 10px; align-items: center;">
                <div>
                    <button id="prev-btn" class="secondary-btn">Previous</button>
                    <button id="mark-review-btn" class="secondary-btn hidden" style="margin-left: 10px;">Mark for Review</button>
                </div>
                <div>
                    <button id="next-btn" class="primary-btn">Next</button>
                    <button id="submit-btn" class="primary-btn" style="display: none;">Submit Quiz</button>
                </div>
            </div>"""

html = re.sub(r'<div class="quiz-controls">.*?</div>', controls_replace, html, flags=re.DOTALL)

# Add Confirmation Modal at the end of body
modal_html = """
    <!-- Submit Confirmation Modal -->
    <div id="submit-confirm-modal" class="modal hidden">
        <div class="modal-content card">
            <h3 style="margin-bottom: 20px;">Submit Full Reasoning Practice?</h3>
            <div style="font-size: 1.1rem; margin-bottom: 25px;">
                <p style="margin-bottom: 10px;">Answered: <strong id="confirm-answered">0</strong> / <strong id="confirm-total">20</strong></p>
                <p style="margin-bottom: 10px;">Unanswered: <strong id="confirm-unanswered">0</strong></p>
                <p style="margin-bottom: 10px;">Marked for Review: <strong id="confirm-marked">0</strong></p>
            </div>
            <div class="actions" style="display: flex; gap: 10px;">
                <button id="confirm-continue-btn" class="secondary-btn" style="flex: 1;">Continue Test</button>
                <button id="confirm-submit-btn" class="primary-btn" style="flex: 1;">Submit Test</button>
            </div>
        </div>
    </div>
"""

if "submit-confirm-modal" not in html:
    html = html.replace('</body>', modal_html + '</body>')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)


# Now CSS
with open('css/styles.css', 'r', encoding='utf-8') as f:
    css = f.read()

new_css = """
/* Modal Styles */
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}
.modal.hidden {
    display: none;
}
.modal-content {
    width: 90%;
    max-width: 400px;
}

/* Palette Styles */
.quiz-palette-container {
    background-color: var(--bg-card);
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    margin-bottom: 20px;
}
.quiz-palette-container.hidden {
    display: none;
}
.quiz-palette {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}
.palette-btn {
    width: 36px;
    height: 36px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--border-color);
    background-color: var(--bg-main);
    color: var(--text-main);
    border-radius: 4px;
    font-weight: bold;
    font-size: 0.9rem;
    transition: all 0.2s;
}
.palette-btn:hover {
    border-color: var(--primary-color);
}
.palette-btn.answered {
    background-color: var(--correct-bg);
    border-color: var(--correct-border);
    color: #166534;
}
.palette-btn.current {
    border: 2px solid var(--primary-color);
    box-shadow: 0 0 0 2px rgba(15, 76, 129, 0.2);
}
.palette-btn.marked {
    background-color: #fef08a;
    border-color: #eab308;
    color: #854d0e;
}
/* Mobile adjustments */
@media (max-width: 600px) {
    .palette-btn {
        width: 32px;
        height: 32px;
        font-size: 0.85rem;
    }
    .quiz-controls > div {
        display: flex;
        width: 100%;
        gap: 10px;
    }
    .quiz-controls > div > button {
        flex: 1;
        margin: 0 !important;
    }
}
"""

css += new_css
with open('css/styles.css', 'w', encoding='utf-8') as f:
    f.write(css)
