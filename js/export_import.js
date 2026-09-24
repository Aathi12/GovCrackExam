// ==========================================
// DATA PORTABILITY (EXPORT / IMPORT)
// ==========================================

function exportProgress() {
    const history = localStorage.getItem(STORAGE_KEY);
    if (!history) {
        alert("No progress data found to export.");
        return;
    }
    
    // Attempt to compute question bank hash from current in-memory questionsBank if loaded
    let currentHash = "2d5596839f832e29603259c6703b2283864e8983504e082ed06e4627aca490dc";
    
    const exportData = {
        format: "govcrackexam-progress-backup",
        version: 1,
        exportedAt: new Date().toISOString(),
        app: { name: "GovCrackExam" },
        compatibility: { questionBankHash: currentHash },
        progress: {
            [STORAGE_KEY]: JSON.parse(history)
        }
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const dateStr = new Date().toISOString().split('T')[0];
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `govcrackexam-progress-${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

let pendingImportData = null;

function handleImportFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            validateAndPreviewImport(data);
        } catch (err) {
            console.error(err);
            alert("Error parsing file. Invalid JSON format.");
        }
        // Reset file input
        event.target.value = '';
    };
    reader.readAsText(file);
}

function validateAndPreviewImport(data) {
    if (!data || data.format !== "govcrackexam-progress-backup") {
        alert("Invalid format: Not a recognized GovCrackExam progress backup.");
        return;
    }
    
    if (data.version !== 1) {
        alert("Unsupported backup version. Please make sure you are using the latest version of the application.");
        return;
    }
    
    const progress = data.progress;
    if (!progress || !progress[STORAGE_KEY]) {
        alert("Invalid format: Missing progress data.");
        return;
    }
    
    const drillData = progress[STORAGE_KEY];
    
    // Strict validation
    if (typeof drillData !== 'object' || drillData === null) {
        alert("Invalid format: Progress data corrupted.");
        return;
    }
    
    const summary = document.getElementById('import-summary');
    let summaryHtml = `<strong>Backup Date:</strong> ${new Date(data.exportedAt || Date.now()).toLocaleString()}<br><br>`;
    
    const expectedHash = "2d5596839f832e29603259c6703b2283864e8983504e082ed06e4627aca490dc";
    if (data.compatibility && data.compatibility.questionBankHash !== expectedHash) {
        summaryHtml += `<div style="color: var(--danger-color); margin-bottom: 10px;"><strong>Warning:</strong> This backup was created with a different version of the question bank. Some questions may no longer exist.</div>`;
    } else {
        summaryHtml += `<div style="color: var(--success-color); margin-bottom: 10px;"><strong>Compatibility:</strong> Fully matched with current question bank.</div>`;
    }
    
    summaryHtml += `<strong>Diagnostics:</strong> ${Array.isArray(drillData.diagnostics) ? drillData.diagnostics.length : 0}<br>`;
    summaryHtml += `<strong>Drills:</strong> ${Array.isArray(drillData.drills) ? drillData.drills.length : 0}<br>`;
    summaryHtml += `<strong>Topic Practices:</strong> ${Array.isArray(drillData.topicPractices) ? drillData.topicPractices.length : 0}<br>`;
    summaryHtml += `<strong>Full Practices:</strong> ${Array.isArray(drillData.fullPractices) ? drillData.fullPractices.length : 0}<br>`;
    summaryHtml += `<strong>Question History:</strong> ${typeof drillData.questionHistory === 'object' && drillData.questionHistory !== null ? Object.keys(drillData.questionHistory).length : 0} items<br>`;
    
    summary.innerHTML = summaryHtml;
    
    pendingImportData = drillData;
    
    const modal = document.getElementById('import-modal');
    modal.style.display = 'flex';
    
    document.getElementById('confirm-import-btn').onclick = function() {
        executeImport();
    };
}

function executeImport() {
    if (!pendingImportData) return;
    
    try {
        // Auto-backup current state just in case (to memory string)
        const currentData = localStorage.getItem(STORAGE_KEY);
        if (currentData) {
             sessionStorage.setItem(STORAGE_KEY + '-safety-backup', currentData);
        }
        
        // Save
        localStorage.setItem(STORAGE_KEY, JSON.stringify(pendingImportData));
        
        document.getElementById('import-modal').style.display = 'none';
        pendingImportData = null;
        
        alert("Progress successfully imported! The application will now reload to apply changes.");
        window.location.reload();
    } catch (e) {
        console.error(e);
        alert("Failed to import progress due to a storage error. Your existing progress is intact.");
    }
}
