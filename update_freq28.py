import json

with open('data/frequency.json', 'r', encoding='utf-8') as f:
    freq = json.load(f)

freq["Classification (Odd One Out)"] = {
    "frequencyWeight": 0.96
}

with open('data/frequency.json', 'w', encoding='utf-8') as f:
    json.dump(freq, f, indent=2)

print("Updated frequency.json")
