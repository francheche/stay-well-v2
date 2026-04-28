import re
import os

def minify_css(content):
    content = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)
    content = re.sub(r'\s+', ' ', content)
    content = re.sub(r'\s*([{:;,])\s*', r'\1', content)
    return content.strip()

def minify_js(content):
    # Remove multi-line comments
    content = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)
    # Disable single-line comment removal as it corrupts URLs and JS logic
    # content = re.sub(r'\s\/\/.*', '', content)
    # Remove excessive whitespace
    content = re.sub(r'\s+', ' ', content)
    return content.strip()

files = [
    ('style.css', 'style.min.css', minify_css),
    ('script.js', 'script.min.js', minify_js)
]

for src, dest, func in files:
    if os.path.exists(src):
        with open(src, 'r') as f:
            content = f.read()
        minified = func(content)
        with open(dest, 'w') as f:
            f.write(minified)
        print(f"Minified {src} -> {dest}")
