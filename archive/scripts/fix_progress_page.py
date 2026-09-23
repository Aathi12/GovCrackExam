import re

with open('js/app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

# 1. Update the empty state check in showProgressScreen
# OLD: if (diags.length === 0) {
# NEW: if (diags.length === 0 && drills.length === 0 && topicPractices.length === 0) {
old_empty_check = "if (diags.length === 0) {"
new_empty_check = "if (diags.length === 0 && drills.length === 0 && topicPractices.length === 0) {"
app_js = app_js.replace(old_empty_check, new_empty_check)

# 2. Update the progress-stat-card for Diagnostic Accuracy to gracefully handle diags.length === 0
old_diag_accuracy_latest = "Latest: ${diags[0].accuracy}%"
new_diag_accuracy_latest = "Latest: ${diags.length > 0 ? diags[0].accuracy + '%' : 'N/A'}"
app_js = app_js.replace(old_diag_accuracy_latest, new_diag_accuracy_latest)

# 3. Update the Topic Progress loop to render if there's any practicesCompleted, and handle allAccs.length === 0
# OLD: if (allAccs.length > 0) {
# NEW: if (allAccs.length > 0 || practicesCompleted > 0) {
old_allaccs_check = "if (allAccs.length > 0) {\n            const latest = allAccs[allAccs.length - 1];\n            const best = Math.max(...allAccs);"
new_allaccs_check = """if (allAccs.length > 0 || practicesCompleted > 0) {
            const latest = allAccs.length > 0 ? allAccs[allAccs.length - 1] + '%' : 'N/A';
            const best = allAccs.length > 0 ? Math.max(...allAccs) + '%' : 'N/A';"""
app_js = app_js.replace(old_allaccs_check, new_allaccs_check)

# Also update the table row interpolation to not add a redundant % sign if it's N/A
app_js = app_js.replace("<td>${latest}%</td>\n                <td>${best}%</td>", "<td>${latest}</td>\n                <td>${best}</td>")

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(app_js)
