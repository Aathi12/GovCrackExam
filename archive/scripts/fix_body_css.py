import re

with open('css/styles.css', 'r', encoding='utf-8') as f:
    css = f.read()

bad_body = """
body {
    min-width: 320px;
    overflow-x: hidden;
}
body {

    font-family:"""

good_body = """
body {
    min-width: 320px;
    overflow-x: hidden;
    font-family:"""

css = css.replace(bad_body, good_body)

with open('css/styles.css', 'w', encoding='utf-8') as f:
    f.write(css)
