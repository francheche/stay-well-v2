const fs = require('fs');

function minifyCSS(content) {
    return content
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\s+/g, ' ')
        .replace(/\s*([{:;,])\s*/g, '$1')
        .trim();
}

function minifyJS(content) {
    // Remove multi-line comments
    content = content.replace(/\/\*[\s\S]*?\*\//g, '');
    
    // Safe single-line comment removal
    const lines = content.split('\n');
    const minifiedLines = lines.map(line => {
        const commentIndex = line.indexOf('//');
        if (commentIndex !== -1) {
            const before = line.substring(0, commentIndex);
            // If the // is preceded by ':' it's likely a URL (http://)
            if (before.trim().endsWith(':')) {
                return line; 
            }
            return before;
        }
        return line;
    });
    
    return minifiedLines
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
}

const files = [
    { src: 'style.css', dest: 'style.min.css', func: minifyCSS },
    { src: 'script.js', dest: 'script.min.js', func: minifyJS }
];

files.forEach(file => {
    try {
        const content = fs.readFileSync(file, 'utf8');
        const minified = file.func(content);
        fs.writeFileSync(file.dest, minified);
        console.log(`Successfully minified ${file.src}`);
    } catch (e) {
        // Fallback for different object structure if needed
        const src = file.src;
        const dest = file.dest;
        if (fs.existsSync(src)) {
            const content = fs.readFileSync(src, 'utf8');
            const minified = file.func(content);
            fs.writeFileSync(dest, minified);
            console.log(`Successfully minified ${src}`);
        }
    }
});
