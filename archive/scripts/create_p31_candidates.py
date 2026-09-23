import json

data = {
  "status": "completed",
  "message": "All text-verifiable Reasoning topics discovered in Phase 24 have been fully integrated.",
  "unrepresentedTopics": [
    {
      "topic": "Dice",
      "status": "INSUFFICIENT DATA — REQUIRES IMAGES",
      "totalOccurrences": 46,
      "cleanCandidates": 0
    },
    {
      "topic": "Mirror Image",
      "status": "INSUFFICIENT DATA — REQUIRES IMAGES",
      "totalOccurrences": 50,
      "cleanCandidates": 0
    },
    {
      "topic": "Paper Folding",
      "status": "INSUFFICIENT DATA — REQUIRES IMAGES",
      "totalOccurrences": 30,
      "cleanCandidates": 0
    },
    {
      "topic": "Embedded Figures",
      "status": "INSUFFICIENT DATA — REQUIRES IMAGES",
      "totalOccurrences": 20,
      "cleanCandidates": 0
    },
    {
      "topic": "Venn Diagram",
      "status": "INSUFFICIENT DATA — REQUIRES IMAGES",
      "totalOccurrences": 10,
      "cleanCandidates": 0
    }
  ]
}

with open('data/phase31_candidates.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print("Created data/phase31_candidates.json")
