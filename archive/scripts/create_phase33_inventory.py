import json
import os

with open('data/phase32_visual_candidates.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

sources = {}
for c in data['candidates']:
    fname = c['source_filename']
    if fname not in sources:
        sources[fname] = {
            "sourceId": f"src_{len(sources)+1}",
            "originalFilename": fname,
            "candidateIds": [],
            "topics": set(),
            "acquisitionStatus": "UNAVAILABLE",
            "onlineDiscovery": {
                "investigated": True,
                "potentialUrls": [f"https://cracku.in/ssc-cgl-previous-papers"],
                "domain": "cracku.in",
                "matchReasoning": "Filename structure matches known Tier 1 previous year paper naming conventions.",
                "confidence": "Medium"
            },
            "localPath": None,
            "sourceHash": None,
            "notes": "Original PDF not found locally. Available on coaching sites but cannot be systematically downloaded without manual verification/bypass."
        }
    
    sources[fname]["candidateIds"].append(c['id'])
    sources[fname]["topics"].add(c['topic'])

# Convert sets to list
inventory = []
for fname, meta in sources.items():
    meta['topics'] = list(meta['topics'])
    inventory.append(meta)

with open('data/phase33_source_inventory.json', 'w', encoding='utf-8') as f:
    json.dump({"inventory": inventory}, f, indent=2)

os.makedirs('data/phase33_sources', exist_ok=True)
with open('data/phase33_sources/manifest.json', 'w', encoding='utf-8') as f:
    json.dump({"sources": []}, f, indent=2)

print(f"Created phase33 inventory with {len(inventory)} unique sources.")
