import re

with open('js/app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

# We need to replace the entire topics.forEach block
old_block_regex = r"topics\.forEach\(t => \{.*?(?=html \+= '</tbody></table></div>';)"

new_block = """topics.forEach(t => {
        const records = [];
        
        diags.forEach(d => {
            const td = d.topicPerformance[t];
            if (td && td.attempted > 0) {
                records.push({ timestamp: new Date(d.timestamp).getTime(), accuracy: td.accuracy });
            }
        });
        
        const topicDrills = drills.filter(d => d.topic === t);
        topicDrills.forEach(d => {
            records.push({ timestamp: new Date(d.timestamp).getTime(), accuracy: d.accuracy });
        });
        
        const topicPracs = topicPractices.filter(d => d.topic === t);
        topicPracs.forEach(d => {
            records.push({ timestamp: new Date(d.timestamp).getTime(), accuracy: d.accuracy });
        });
        
        let drillsCompleted = topicDrills.length;
        let practicesCompleted = topicPracs.length;
        
        let latestDisplay = 'N/A';
        let bestDisplay = 'N/A';
        let statusHTML = '<span class="change-neutral">-</span>';
        
        if (records.length > 0) {
            records.sort((a, b) => a.timestamp - b.timestamp);
            
            const allAccs = records.map(r => r.accuracy);
            
            const latestVal = allAccs[allAccs.length - 1];
            const bestVal = Math.max(...allAccs);
            
            latestDisplay = latestVal + '%';
            bestDisplay = bestVal + '%';
            
            if (allAccs.length >= 2) {
                const prev = allAccs[allAccs.length - 2];
                if (latestVal > prev) {
                    statusHTML = '<span class="change-positive">Improved</span>';
                } else if (latestVal < prev) {
                    statusHTML = '<span class="change-negative">Needs More Practice</span>';
                } else {
                    statusHTML = '<span class="change-neutral">No Change</span>';
                }
            }
        }
        
        html += `<tr>
            <td>${t}</td>
            <td>${latestDisplay}</td>
            <td>${bestDisplay}</td>
            <td>${statusHTML}</td>
            <td>${drillsCompleted}</td>
            <td>${practicesCompleted}</td>
        </tr>`;
    });
    
    """

# Replace
if re.search(old_block_regex, app_js, flags=re.DOTALL):
    app_js = re.sub(old_block_regex, new_block, app_js, flags=re.DOTALL)
    print("Replaced successfully")
else:
    print("Could not find block")

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(app_js)
