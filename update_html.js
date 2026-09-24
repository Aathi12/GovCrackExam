const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const modalHtml = `
    <div id="import-modal" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center;" role="dialog" aria-labelledby="import-modal-title" aria-modal="true">
        <div style="background: var(--card-bg); padding: 20px; border-radius: 8px; max-width: 500px; width: 90%; border: 1px solid var(--border-color); box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h3 id="import-modal-title" style="margin-top: 0;">Import Progress Backup</h3>
            <div id="import-summary" style="margin: 15px 0; font-size: 0.9rem; line-height: 1.5; color: var(--text-color);"></div>
            <p style="color: var(--danger-color); font-weight: bold; margin-bottom: 20px;">Importing will replace your current saved progress on this browser.</p>
            <div style="display: flex; gap: 10px;">
                <button class="btn btn-primary" id="confirm-import-btn">Yes, Replace Progress</button>
                <button class="btn btn-secondary" onclick="document.getElementById('import-modal').style.display = 'none';">Cancel</button>
            </div>
        </div>
    </div>
`;

html = html.replace('<!-- Progress Screen -->', modalHtml + '\n          <!-- Progress Screen -->');

const portabilityHtml = `
              <div class="data-portability-controls" style="display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap;">
                  <button class="btn btn-secondary" onclick="exportProgress()">Export Backup</button>
                  <button class="btn btn-secondary" onclick="document.getElementById('import-file').click()">Import Backup</button>
                  <input type="file" id="import-file" accept=".json" style="display: none;" onchange="handleImportFile(event)" aria-label="Import Progress File">
              </div>
`;

html = html.replace('<h2>Your Progress</h2>', '<h2>Your Progress</h2>' + portabilityHtml);
fs.writeFileSync('index.html', html);
console.log('Modified index.html');
