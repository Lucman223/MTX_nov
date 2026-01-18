const fs = require('fs');
const path = require('path');

const filesToConvert = [
    'PRESENTACION_PLATAFORMA.md',
    'PRESENTATION_PLATEFORME_FR.md'
];

const template = (title, body) => `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
        }
        img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            margin: 1rem 0;
            display: block;
        }
        h1, h2, h3 { color: #111; margin-top: 2rem; }
        h1 { border-bottom: 2px solid #eee; padding-bottom: 0.5rem; }
        hr { border: 0; border-top: 1px solid #eee; margin: 2rem 0; }
        code { background: #f5f5f5; padding: 0.2rem 0.4rem; border-radius: 4px; font-family: monospace; }
    </style>
</head>
<body>
    ${body}
</body>
</html>
`;

filesToConvert.forEach(fileName => {
    const inputPath = path.join(__dirname, fileName);
    if (!fs.existsSync(inputPath)) {
        console.log(`Skipping ${fileName}: file not found`);
        return;
    }

    let content = fs.readFileSync(inputPath, 'utf8');

    // Simple Markdown Parsing

    // Headers
    content = content.replace(/^# (.*$)/gm, '<h1>$1</h1>');
    content = content.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    content = content.replace(/^### (.*$)/gm, '<h3>$1</h3>');

    // Horizontal Rules
    content = content.replace(/^---$/gm, '<hr>');

    // Bold
    content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Lists (simple hyphen lists)
    content = content.replace(/^- (.*$)/gm, '<li>$1</li>');
    // Wrap lists (very naive, assumes contiguous lists)
    // Actually, let's just leave li's, browsers handle them okayish or standard parsing is better, 
    // but for this specific presentation format, bullets are fine.
    // Let's wrap contiguous li's in ul for better styling if possible, but simplest is just replacing the dash.

    // Line breaks
    content = content.replace(/\n\n/g, '<br><br>');

    // Images: ![alt](src)
    content = content.replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, src) => {
        // Resolve path. The src is relative e.g. "general_home.png"
        // remove any leading ./ or just take the filename
        const imageName = path.basename(src);
        const imagePath = path.join(__dirname, imageName);

        if (fs.existsSync(imagePath)) {
            const ext = path.extname(imagePath).substring(1); // png, jpg
            const base64 = fs.readFileSync(imagePath, 'base64');
            const dataUri = `data:image/${ext};base64,${base64}`;
            return `<img src="${dataUri}" alt="${alt}">`;
        } else {
            console.warn(`Image not found: ${imagePath}`);
            return `[Image not found: ${src}]`;
        }
    });

    const outputFileName = fileName.replace('.md', '_SHAREABLE.html');
    const outputPath = path.join(__dirname, outputFileName);

    const title = fileName.replace('.md', '').replace(/_/g, ' ');
    const html = template(title, content);

    fs.writeFileSync(outputPath, html);
    console.log(`Generated ${outputFileName}`);
});
