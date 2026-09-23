import re

def update_index():
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()
    
    # 1. Add Question Review Section to Progress Screen
    prog_content_search = '''            <div id="progress-content">'''
    prog_content_replace = '''            <div id="progress-content">
                <!-- Question Review Section will be dynamically added here or below -->'''
    
    # Let's add it exactly before actions div
    actions_search = '''            <div class="actions" style="margin-top: 30px; display: flex; flex-direction: column; gap: 10px;">'''
    
    qr_html = '''
            <div id="question-review-section" style="margin-top: 30px;">
                <h3 style="margin-bottom: 15px;">Question Review</h3>
                <p style="margin-bottom: 15px; font-size: 0.9rem; color: var(--text-muted);">Based on your recorded attempts.</p>
                <div style="display: flex; gap: 10px; margin-bottom: 15px; flex-wrap: wrap;">
                    <select id="qr-status-filter" class="dropdown" style="flex: 1; min-width: 150px;">
                        <option value="All">All Statuses</option>
                        <option value="Needs Practice">Needs Practice</option>
                        <option value="Frequently Missed">Frequently Missed</option>
                        <option value="Improving">Improving</option>
                        <option value="Mastered">Mastered</option>
                    </select>
                    <select id="qr-topic-filter" class="dropdown" style="flex: 1; min-width: 150px;">
                        <option value="All">All Topics</option>
                        <option value="Dictionary Order">Dictionary Order</option>
                        <option value="Syllogism">Syllogism</option>
                        <option value="Blood Relations">Blood Relations</option>
                        <option value="Mathematical Operations">Mathematical Operations</option>
                        <option value="Coded Language">Coded Language</option>
                        <option value="Letter-cluster Analogy / Series">Letter-cluster Analogy / Series</option>
                        <option value="Number/Figure Series">Number/Figure Series</option>
                        <option value="Classification (Odd One Out)">Classification (Odd One Out)</option>
                        <option value="Analogy (Word/Number)">Analogy (Word/Number)</option>
                    </select>
                    <select id="qr-diff-filter" class="dropdown" style="flex: 1; min-width: 150px;">
                        <option value="All">All Difficulties</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                </div>
                <div id="qr-results-container" style="display: flex; flex-direction: column; gap: 10px; max-height: 500px; overflow-y: auto;">
                    <!-- Dynamically populated -->
                </div>
            </div>
            
            <div class="actions" style="margin-top: 30px; display: flex; flex-direction: column; gap: 10px;">'''
            
    if 'id="question-review-section"' not in html:
        html = html.replace(actions_search, qr_html)
        
    # 2. Add Question Review Modal
    modal_search = '''    <!-- Submit Confirmation Modal -->'''
    qr_modal = '''    <!-- Question Review Modal -->
    <div id="qr-modal" class="modal hidden">
        <div class="modal-content card" style="max-width: 600px; text-align: left;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h3 style="margin: 0;">Review Question</h3>
                <span id="qr-close-icon" style="cursor: pointer; font-size: 1.5rem; line-height: 1;">&times;</span>
            </div>
            <div id="qr-modal-content">
                <!-- Dynamically populated -->
            </div>
            <div class="actions" style="margin-top: 20px; display: flex; gap: 10px;">
                <button id="qr-close-btn" class="secondary-btn" style="flex: 1;">Close</button>
            </div>
        </div>
    </div>

    <!-- Submit Confirmation Modal -->'''
    
    if 'id="qr-modal"' not in html:
        html = html.replace(modal_search, qr_modal)
        
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
        
if __name__ == '__main__':
    update_index()
