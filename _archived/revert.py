import os

def revert_html(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content.replace('../style.min.css', '../style.css').replace('../script.min.js', '../script.js')
    
    if content != new_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Reverted {file_path}")

for root, dirs, files in os.walk('.'):
    for file in files:
        if file.endswith('.html') and root != '.':
            revert_html(os.path.join(root, file))
