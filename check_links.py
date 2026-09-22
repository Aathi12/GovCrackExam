import os, re

broken = []
for root, _, files in os.walk('.'):
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            links = re.findall(r'href=[\'"](.*?)[\'"]', content)
            for link in links:
                if link.startswith('http') or link.startswith('#') or link.startswith('mailto:') or link.startswith('tel:'):
                    continue
                # Normalize link
                target = os.path.join(os.path.dirname(filepath), link)
                target = os.path.normpath(target)
                if not os.path.exists(target):
                    broken.append((filepath, link))
            
            scripts = re.findall(r'src=[\'"](.*?)[\'"]', content)
            for src in scripts:
                if src.startswith('http'):
                    continue
                target = os.path.join(os.path.dirname(filepath), src)
                target = os.path.normpath(target)
                if not os.path.exists(target):
                    broken.append((filepath, src))

print('Broken references:', broken)
