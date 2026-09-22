import json

with open('data/frequency.json', 'r', encoding='utf-8') as f:
    freq = json.load(f)

# Number/Figure Series
# clean candidates: 135
# total occurrences: 173
# weight = 135 / 173 = 0.78
freq['Number/Figure Series'] = {
    "frequencyWeight": 0.78
}

with open('data/frequency.json', 'w', encoding='utf-8') as f:
    json.dump(freq, f, indent=2)

print("Updated frequency.json")
