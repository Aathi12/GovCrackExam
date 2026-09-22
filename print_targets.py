import json

with open('data/questions.json', 'r', encoding='utf-8') as f:
    qs = json.load(f)

targets = ['fb478cb6-ed9a-412c-aa7d-fecbe6b2ab21', 'af25551c-6fad-4fc7-9d41-d87e65550365', '7a5cb939-3d7f-48cd-a2ec-e718ba0b0c5c', '1fab3855-7d90-4af3-b9eb-1896285c2693', '3f478fcd-8357-4509-9d38-e8b226f9e7a5', '021a9c97-0f10-4576-aa7d-c634af4b7073', 'fdd5601b-47a5-4557-a8ee-0a1494f90dc4', 'b0deeeb7-b930-4ce4-9bb8-f3103405d126', 'be787f11-f8a8-4a00-9453-0e5d3b432733', '41c37683-27c6-46e0-afa5-bbfd6005b6cf', 'f9d93d98-0677-419a-9a69-36bef1fcda73']

for t in targets:
    q = next((x for x in qs if x['qid'] == t), None)
    if q:
        print(f"\nID: {t}")
        print(f"Q: {q['question']}")
        print(f"Opts: {q['options']}")
        print(f"Ans: {q['correctOption']} ({q['options'][q['correctOption']-1]})")
        print(f"Exp: {q['explanation']}")
