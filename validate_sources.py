import os
import json
import hashlib
from datetime import datetime

SOURCES_DIR = 'data/phase33_sources'
INVENTORY_FILE = 'data/phase33_source_inventory.json'
MANIFEST_FILE = os.path.join(SOURCES_DIR, 'manifest.json')
CANDIDATES_FILE = 'data/phase32_visual_candidates.json'

def compute_sha256(filepath):
    sha256_hash = hashlib.sha256()
    try:
        with open(filepath, "rb") as f:
            for byte_block in iter(lambda: f.read(4096), b""):
                sha256_hash.update(byte_block)
        return sha256_hash.hexdigest()
    except:
        return None

def validate_sources():
    with open(INVENTORY_FILE, 'r', encoding='utf-8') as f:
        inventory_data = json.load(f)
    
    with open(CANDIDATES_FILE, 'r', encoding='utf-8') as f:
        candidates_data = json.load(f)

    # Build lookup
    filename_to_source = {s['originalFilename']: s for s in inventory_data['inventory']}
    sourceId_to_candidates = {s['sourceId']: s['candidateIds'] for s in inventory_data['inventory']}
    
    manifest_sources = []
    
    pdf_files = [f for f in os.listdir(SOURCES_DIR) if f.lower().endswith('.pdf')]
    
    for pdf_file in pdf_files:
        filepath = os.path.join(SOURCES_DIR, pdf_file)
        file_size = os.path.getsize(filepath)
        sha256 = compute_sha256(filepath)
        
        # Simple validation mock for valid PDF (check header)
        is_valid_pdf = False
        try:
            with open(filepath, 'rb') as f:
                header = f.read(4)
                if header == b'%PDF':
                    is_valid_pdf = True
        except:
            pass
            
        status = 'INVALID_PDF'
        sourceId = None
        notes = "Invalid PDF file structure."
        c_ids = []
        topics = []
        
        if is_valid_pdf:
            if pdf_file in filename_to_source:
                src = filename_to_source[pdf_file]
                sourceId = src['sourceId']
                status = 'VERIFIED_SOURCE'
                notes = "Verified matching source filename and valid PDF."
                c_ids = src['candidateIds']
                topics = src['topics']
            else:
                status = 'VALID_PDF_IDENTITY_UNCONFIRMED'
                notes = "PDF is valid but filename does not match any known source inventory."

        manifest_sources.append({
            "sourceId": sourceId,
            "originalFilename": pdf_file,
            "storedFilename": pdf_file,
            "sha256": sha256,
            "fileSize": file_size,
            "pageCount": "Unknown (Mock)",
            "identityStatus": status,
            "verificationNotes": notes,
            "candidateIds": c_ids,
            "topics": topics,
            "ingestionTimestamp": datetime.utcnow().isoformat() + "Z"
        })
    
    # Update candidate backed status
    verified_source_ids = {s['sourceId'] for s in manifest_sources if s['identityStatus'] == 'VERIFIED_SOURCE'}
    
    for c in candidates_data['candidates']:
        # Need to find which source this candidate belongs to
        c_source_id = None
        for s in inventory_data['inventory']:
            if c['id'] in s['candidateIds']:
                c_source_id = s['sourceId']
                break
                
        c['sourceBacked'] = c_source_id in verified_source_ids
    
    with open(MANIFEST_FILE, 'w', encoding='utf-8') as f:
        json.dump({"sources": manifest_sources}, f, indent=2)
        
    with open(CANDIDATES_FILE, 'w', encoding='utf-8') as f:
        json.dump(candidates_data, f, indent=2)
        
    print(f"Validated {len(pdf_files)} PDFs. {len(verified_source_ids)} verified.")

if __name__ == '__main__':
    validate_sources()
