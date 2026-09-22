import re

def update_index():
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # Diagnostic Results Screen action buttons
    search = '''            <div class="actions" style="margin-top: 30px;">
                <button id="start-drill-btn" class="primary-btn">Drill My Weak Topics</button>'''
    
    replace = '''            <div class="actions" style="margin-top: 30px; display: flex; flex-direction: column; align-items: center; gap: 15px;">
                <label style="cursor: pointer; font-size: 0.95rem; color: var(--text-muted); display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox" id="adaptive-drill-toggle" checked style="width: 18px; height: 18px;">
                    Adaptive Selection (Recommended)
                </label>
                <div style="display: flex; gap: 10px; width: 100%; justify-content: center;">
                    <button id="start-drill-btn" class="primary-btn" style="flex: 1; max-width: 300px;">Drill My Weak Topics</button>
                    <button id="home-btn" class="secondary-btn" style="flex: 1; max-width: 300px;">Back to Home</button>
                </div>'''
    
    # Actually wait, we should just match the start-drill-btn line.
    simple_search = '''<button id="start-drill-btn" class="primary-btn">Drill My Weak Topics</button>'''
    simple_replace = '''
                <div style="margin-bottom: 15px; width: 100%; text-align: center;">
                    <label style="cursor: pointer; font-size: 0.95rem; color: var(--text-muted); display: inline-flex; align-items: center; gap: 8px;">
                        <input type="checkbox" id="adaptive-drill-toggle" checked style="width: 16px; height: 16px;">
                        Adaptive Selection
                    </label>
                </div>
                <button id="start-drill-btn" class="primary-btn">Drill My Weak Topics</button>'''
                
    if 'id="adaptive-drill-toggle"' not in html:
        html = html.replace(simple_search, simple_replace)
        
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)

if __name__ == '__main__':
    update_index()
