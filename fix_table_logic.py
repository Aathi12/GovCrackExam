import re

with open('js/app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

# Let's cleanly replace the Topic Progress table loop block
old_block = """        if (allAccs.length > 0 || practicesCompleted > 0) {
            const latest = allAccs.length > 0 ? allAccs[allAccs.length - 1] + '%' : 'N/A';
            const best = allAccs.length > 0 ? Math.max(...allAccs) + '%' : 'N/A';
            
            let statusHTML = '<span class="change-neutral">No Change</span>';
            if (allAccs.length >= 2) {
                const prev = allAccs[allAccs.length - 2];
                if (latest > prev) {
                    statusHTML = '<span class="change-positive">Improved</span>';
                } else if (latest < prev) {
                    statusHTML = '<span class="change-negative">Needs More Practice</span>';
                }
            } else {
                statusHTML = '<span class="change-neutral">-</span>';
            }
            
            html += `<tr>
                <td>${t}</td>
                <td>${latest}</td>
                <td>${best}</td>
                <td>${statusHTML}</td>
                <td>${drillsCompleted}</td>
                <td>${practicesCompleted}</td>
            </tr>`;
        }"""

new_block = """        if (allAccs.length > 0 || practicesCompleted > 0) {
            const latestVal = allAccs.length > 0 ? allAccs[allAccs.length - 1] : null;
            const bestVal = allAccs.length > 0 ? Math.max(...allAccs) : null;
            
            const latestDisplay = latestVal !== null ? latestVal + '%' : 'N/A';
            const bestDisplay = bestVal !== null ? bestVal + '%' : 'N/A';
            
            let statusHTML = '<span class="change-neutral">No Change</span>';
            if (allAccs.length >= 2) {
                const prev = allAccs[allAccs.length - 2];
                if (latestVal > prev) {
                    statusHTML = '<span class="change-positive">Improved</span>';
                } else if (latestVal < prev) {
                    statusHTML = '<span class="change-negative">Needs More Practice</span>';
                }
            } else {
                statusHTML = '<span class="change-neutral">-</span>';
            }
            
            html += `<tr>
                <td>${t}</td>
                <td>${latestDisplay}</td>
                <td>${bestDisplay}</td>
                <td>${statusHTML}</td>
                <td>${drillsCompleted}</td>
                <td>${practicesCompleted}</td>
            </tr>`;
        }"""

if old_block in app_js:
    app_js = app_js.replace(old_block, new_block)
else:
    print("Could not find old_block to replace.")
    # Maybe whitespace is slightly off, let's use regex
    pass

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(app_js)
