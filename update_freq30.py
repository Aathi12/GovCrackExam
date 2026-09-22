import json

with open('data/frequency.json', 'r', encoding='utf-8') as f:
    freq = json.load(f)

freq["Analogy (Word/Number)"] = {
    "frequencyWeight": 0.94
}

with open('data/frequency.json', 'w', encoding='utf-8') as f:
    json.dump(freq, f, indent=2)

print("Updated frequency.json")
