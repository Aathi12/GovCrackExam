import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

new_link = '                    <a href="number-figure-series.html" class="secondary-btn" style="text-decoration: none; text-align: center;" title="Practice verified SSC CGL Number/Figure Series questions.">Number/Figure Series</a>\n'

html = html.replace('                    <a href="syllogism.html" class="secondary-btn" style="text-decoration: none; text-align: center;">Syllogism</a>\n',
                    '                    <a href="syllogism.html" class="secondary-btn" style="text-decoration: none; text-align: center;">Syllogism</a>\n' + new_link)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Updated index.html")
