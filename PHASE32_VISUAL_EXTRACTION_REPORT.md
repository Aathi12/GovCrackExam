# Phase 32 — Visual Extraction Pipeline Report

## 1. Number of Candidates per Topic
Based on the text references mapped within the `SSC_CGL_ALL_PAPERS.txt` corpus:
- **Dice**: 48 candidates
- **Mirror Image**: 36 candidates
- **Paper Folding**: 24 candidates
- **Embedded Figures**: 21 candidates
- **Venn Diagram**: 8 candidates

Total candidates traced: **137**

## 2. Source Traceability & Availability
A comprehensive audit of the local filesystem (including OneDrive and project directories) was conducted to map the corpus filename references (e.g., `3-march-shift-1-2019.pdf`) back to original visual source files.
- Number of unique source references found in corpus: 251
- Number of original visual files available locally: 0
- Number unavailable: 251
- Number corrupted/unusable: 0
- Number OCR-only: 137 (All extracted candidates are exclusively OCR traces)
- Number potentially recoverable: 137 (If the original 251 PDFs are successfully sourced and placed in the project, the pipeline can process them).

## 3. Source Availability by Topic
For all 5 topics:
- **Dice**: SOURCE REFERENCE FOUND BUT FILE UNAVAILABLE
- **Mirror Image**: SOURCE REFERENCE FOUND BUT FILE UNAVAILABLE
- **Paper Folding**: SOURCE REFERENCE FOUND BUT FILE UNAVAILABLE
- **Embedded Figures**: SOURCE REFERENCE FOUND BUT FILE UNAVAILABLE
- **Venn Diagram**: SOURCE REFERENCE FOUND BUT FILE UNAVAILABLE

## 4. Source Formats Encountered
The corpus references point exclusively to standard `.pdf` files indicating full exam shifts (e.g., `3-march-shift-1-2019.pdf`, `23-September-Shift-3.pdf`). 

## 5. Visual Extraction Pipeline
A scalable, reproducible pipeline has been architected to handle these missing PDFs. 
1. **Metadata Association**: Corpus files are parsed and linked to `candidate-id`.
2. **Directory Structure**: 
   `data/phase32_visual_sources/<candidate-id>/`
3. **Artifacts**: 
   - `metadata.json` has been successfully created for all 137 missing candidates.
   - *Image rendering, cropping, and artifact generation (`source.*`, `question_crop.*`) are designed but deferred until physical PDFs are provided.*

## 6. Extraction Limitations
Currently, 100% of the visual candidates are blocked by missing source files. The text OCR layers often merely state "Select the figure..." providing zero logical information without the accompanying graphics.

## 7. Recommended Next Action
**Do not proceed with integrating visual questions until the original PDFs are sourced.**
The pipeline is fully operational for metadata traceability. The immediate next action should be locating and downloading the 251 original SSC CGL PDFs mapped in the corpus to hydrate the `phase32_visual_sources` artifacts.
