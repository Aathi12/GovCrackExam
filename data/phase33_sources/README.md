# Visual Question Source Directory

This directory (`data/phase33_sources/`) is strictly for the site owner to supply legitimately acquired original SSC CGL PDF exam files.

## Guidelines for Supplying Source PDFs
- **Acquisition**: PDFs must be obtained legitimately by the site owner. Do not use automated scrapers to bypass CAPTCHAs, logins, paywalls, anti-bot controls, or access restrictions.
- **Identity**: Exact source identity must be preserved. The ingestion pipeline relies on filename and metadata matching. 
- **Renaming**: Do not rename files arbitrarily. Ensure the filenames roughly match the Phase 33 inventory conventions (e.g., `12-Dec-shift-4.pdf`).
- **Validation**: The pipeline will validate PDF integrity, compute SHA-256 hashes, and extract metadata. A PDF is NOT considered verified merely because it is valid; its identity must match a known `sourceId`.
- **No Substitutes**: Do not provide unrelated PDFs or generic reasoning compilations as substitutes for the exact shifts referenced.

Place the `.pdf` files directly in this folder. The `validate_sources.py` script will automatically process them and update the `manifest.json`.
