# Release Checklist

This checklist must be fully verified and pass before any production deployment.

## 1. Source-data verification
- [ ] `data/project_metadata.json` matches current source files
- [ ] `PROJECT_STATE.md` represents current source truth
- [ ] `README.md` is in alignment

## 2. Question-bank integrity
- [ ] `data/questions.json` length is verified
- [ ] No duplicate IDs
- [ ] Required fields (id, question, options, answer, explanation, subtopic, difficulty) are complete
- [ ] `questionBankHash` in metadata matches current hash (immutability check)

## 3. Difficulty integrity
- [ ] Easy, Medium, and Hard string values are properly capitalized and tally to the expected sum

## 4. Frequency integrity
- [ ] `data/frequency.json` contains a weight for every topic present in `questions.json`

## 5. Adaptive logic
- [ ] Priority Score calculation remains deterministically weighted
- [ ] Adaptive question selection respects the 7 factors

## 6. Privacy
- [ ] No `google-analytics`, `gtag`, `pixel`, or other tracking scripts
- [ ] No backend dependency introduced
- [ ] Architecture remains 100% `localStorage` client-side

## 7. Accessibility
- [ ] ARIA tags intact on modals and interactive elements
- [ ] Native keyboard navigation (Tab/Esc) functions cleanly
- [ ] Mobile viewport CSS limits horizontal overflow

## 8. SEO
- [ ] `sitemap.xml` generated and reachable
- [ ] `robots.txt` generated and reachable
- [ ] JSON-LD schema valid on `index.html` and topic pages
- [ ] Canonical URLs point exclusively to the production domain

## 9. Regression tests
- [ ] All `test_*.js` scripts executed and PASSED

## 10. Deployment
- [ ] No `localhost` URLs inside production HTML
- [ ] No leaked `.env`, API keys, or tokens in source

## 11. Live verification
- [ ] Production Smoke Tests run against live deployed endpoint
