import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace inline style for topic grid
html = html.replace('style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 15px;"', 'class="topic-practice-grid"')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

with open('css/styles.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Add .topic-practice-grid class
grid_css = """
.topic-practice-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 10px;
    margin-top: 15px;
}
"""
css += grid_css

# Make sure we also adjust the grid for small screens if needed
# Actually auto-fit with minmax 200px will naturally drop to 1fr on a 320px screen, which is perfect!

with open('css/styles.css', 'w', encoding='utf-8') as f:
    f.write(css)
