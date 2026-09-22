import re

with open('css/styles.css', 'r', encoding='utf-8') as f:
    css = f.read()

focus_styles = """
button:focus, a:focus {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
}

.option:focus {
    outline: 2px solid var(--primary-color);
    outline-offset: 1px;
}
"""
css += focus_styles

with open('css/styles.css', 'w', encoding='utf-8') as f:
    f.write(css)
