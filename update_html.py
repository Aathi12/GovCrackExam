import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Fix modals
html = html.replace('id="qr-modal" class="modal hidden"', 'id="qr-modal" class="modal hidden" role="dialog" aria-modal="true" aria-labelledby="qr-modal-title"')
html = html.replace('<h3 style="margin: 0;">Review Question</h3>', '<h3 id="qr-modal-title" style="margin: 0;">Review Question</h3>')

html = html.replace('id="submit-confirm-modal" class="modal hidden"', 'id="submit-confirm-modal" class="modal hidden" role="dialog" aria-modal="true" aria-labelledby="submit-modal-title"')
html = html.replace('<h3 style="margin-bottom: 20px;">Submit Full Reasoning Practice?</h3>', '<h3 id="submit-modal-title" style="margin-bottom: 20px;">Submit Full Reasoning Practice?</h3>')

html = html.replace('id="report-issue-modal" class="modal hidden"', 'id="report-issue-modal" class="modal hidden" role="dialog" aria-modal="true" aria-labelledby="report-modal-title"')
html = html.replace('<h3 style="margin-bottom: 15px; color: var(--primary-color);">Report an Issue</h3>', '<h3 id="report-modal-title" style="margin-bottom: 15px; color: var(--primary-color);">Report an Issue</h3>')

html = html.replace('id="review-question-modal" class="modal hidden"', 'id="review-question-modal" class="modal hidden" role="dialog" aria-modal="true" aria-labelledby="review-modal-title"')
html = html.replace('<h3 style="color: var(--primary-color); margin: 0;">Review Question</h3>', '<h3 id="review-modal-title" style="color: var(--primary-color); margin: 0;">Review Question</h3>')

# Fix close buttons (spans to buttons or add aria/role/tabindex)
html = html.replace('<span id="qr-close-icon" style="cursor: pointer; font-size: 1.5rem; line-height: 1;">&times;</span>', '<button id="qr-close-icon" aria-label="Close" style="background: none; border: none; cursor: pointer; font-size: 1.5rem; line-height: 1; color: var(--text-color); padding: 0;">&times;</button>')
html = html.replace('<button id="review-close-icon" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-muted);">&times;</button>', '<button id="review-close-icon" aria-label="Close" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-muted); padding: 0;">&times;</button>')

# Adaptive drill aria-describedby
html = html.replace('<input type="checkbox" id="adaptive-toggle" style="width: 18px; height: 18px;" checked>', '<input type="checkbox" id="adaptive-toggle" style="width: 18px; height: 18px;" aria-describedby="adaptive-desc" checked>')
html = html.replace('<p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 5px;">Prioritizes your weakest, unseen, and recently missed questions within the topic.</p>', '<p id="adaptive-desc" style="font-size: 0.85rem; color: var(--text-muted); margin-top: 5px;">Prioritizes your weakest, unseen, and recently missed questions within the topic.</p>')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
