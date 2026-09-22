def fix_index():
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # Topic Practice filter
    select_pos = html.find('id="topic-select"')
    if select_pos != -1:
        end_select = html.find('</select>', select_pos) + len('</select>')
        if html.find('difficulty-select', select_pos, select_pos + 1000) == -1:
            diff_html = '''
                    <label for="difficulty-select" style="margin-top: 15px; display: block;">Select Difficulty:</label>
                    <select id="difficulty-select" class="dropdown" style="width: 100%; margin-bottom: 20px;">
                        <option value="All">All Difficulties</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>'''
            html = html[:end_select] + diff_html + html[end_select:]
            
    # Diagnostic difficulty results container
    topic_results_pos = html.find('id="topic-results"')
    if topic_results_pos != -1:
        end_topic_results = html.find('</div>', topic_results_pos) + len('</div>')
        if html.find('difficulty-results', topic_results_pos, topic_results_pos + 500) == -1:
            diff_res_html = '''
            <div id="difficulty-results" style="margin-top: 20px;"></div>'''
            html = html[:end_topic_results] + diff_res_html + html[end_topic_results:]

    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)

if __name__ == '__main__':
    fix_index()
