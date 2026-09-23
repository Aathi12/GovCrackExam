import re
with open('verify_batch_25.py', 'r', encoding='utf-8') as f:
    code = f.read()
code = code.replace('f\\"\\"\\"', 'f"""')
code = code.replace('\\"\\"\\"', '"""')
with open('verify_batch_25.py', 'w', encoding='utf-8') as f:
    f.write(code)
