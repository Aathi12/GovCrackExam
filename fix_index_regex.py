import re

def fix_index():
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # Topic Practice filter
    select_match = re.search(r'(<select id="topic-select".*?</select>)', html, flags=re.DOTALL)
    if select_match:
        if 'difficulty-select' not in html:
            diff_html = '''
                    <label for="difficulty-select" style="margin-top: 15px; display: block;">Select Difficulty:</label>
                    <select id="difficulty-select" class="dropdown" style="width: 100%; margin-bottom: 20px;">
                        <option value="All">All Difficulties</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>'''
            html = html.replace(select_match.group(1), select_match.group(1) + diff_html)

    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)

if __name__ == '__main__':
    fix_index()
