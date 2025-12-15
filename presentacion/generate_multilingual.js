const fs = require('fs');
const path = require('path');

const languages = [
    { code: 'es', file: 'PRESENTACION_PLATAFORMA.md', name: 'Español' },
    { code: 'fr', file: 'PRESENTATION_PLATEFORME_FR.md', name: 'Français' },
    { code: 'en', file: 'PRESENTATION_PLATFORM_EN.md', name: 'English' },
    { code: 'ar', file: 'PRESENTATION_PLATFORM_AR.md', name: 'العربية', dir: 'rtl' }
];

const imageCache = {};

function parseMarkdown(content) {
    // Headers
    content = content.replace(/^# (.*$)/gm, '<h1>$1</h1>');
    content = content.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    content = content.replace(/^### (.*$)/gm, '<h3>$1</h3>');

    // Horizontal Rules
    content = content.replace(/^---$/gm, '<hr>');

    // Bold
    content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Lists
    content = content.replace(/^- (.*$)/gm, '<li>$1</li>');

    // Line breaks
    content = content.replace(/\n\n/g, '<br><br>');

    // Images: custom replacement to use data attribute for optimization
    content = content.replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, src) => {
        const imageName = path.basename(src);

        // Cache image if not already
        if (!imageCache[imageName]) {
            const imagePath = path.join(__dirname, imageName);
            if (fs.existsSync(imagePath)) {
                const ext = path.extname(imagePath).substring(1);
                const base64 = fs.readFileSync(imagePath, 'base64');
                imageCache[imageName] = `data:image/${ext};base64,${base64}`;
            } else {
                console.warn(`Image not found: ${imagePath}`);
            }
        }

        return `<img data-img-name="${imageName}" alt="${alt}">`;
    });

    return content;
}

const template = (sections, imageJson) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MotoTX Platform Presentation</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 900px;
            margin: 0 auto;
            padding: 2rem;
            background-color: #f9f9f9;
        }
        .container {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            margin: 1rem 0;
            display: block;
        }
        h1, h2, h3 { color: #111; margin-top: 2rem; }
        h1 { border-bottom: 2px solid #eee; padding-bottom: 0.5rem; text-align: center; color: #2563eb; }
        hr { border: 0; border-top: 1px solid #eee; margin: 2rem 0; }
        
        /* Language Selector */
        .controls {
            text-align: center;
            margin-bottom: 2rem;
            position: sticky;
            top: 1rem;
            z-index: 100;
            background: rgba(255,255,255,0.95);
            padding: 1rem;
            border-radius: 50px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            backdrop-filter: blur(5px);
            display: inline-block;
            left: 50%;
            transform: translateX(-50%);
            width: max-content;
        }
        .btn-lang {
            background: transparent;
            border: 1px solid #e5e7eb;
            padding: 0.5rem 1rem;
            margin: 0 0.25rem;
            border-radius: 20px;
            cursor: pointer;
            font-weight: 600;
            color: #6b7280;
            transition: all 0.2s;
        }
        .btn-lang:hover {
            background: #f3f4f6;
            transform: translateY(-1px);
        }
        .btn-lang.active {
            background: #2563eb;
            color: white;
            border-color: #2563eb;
            box-shadow: 0 2px 5px rgba(37, 99, 235, 0.3);
        }
        
        .content-section {
            display: none;
            animation: fadeIn 0.3s ease-in;
        }
        .content-section.active {
            display: block;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
</head>
<body>
    <div style="text-align: center;">
        <div class="controls">
            ${languages.map(l =>
    `<button class="btn-lang" onclick="setLang('${l.code}')" id="btn-${l.code}">${l.name}</button>`
).join('')}
        </div>
    </div>

    <div class="container">
        ${sections}
    </div>

    <script>
        const images = ${imageJson};
        
        // Hydrate images
        document.querySelectorAll('img[data-img-name]').forEach(img => {
            const name = img.dataset.imgName;
            if (images[name]) {
                img.src = images[name];
            }
        });

        function setLang(code) {
            // Hide all
            document.querySelectorAll('.content-section').forEach(el => el.classList.remove('active'));
            document.querySelectorAll('.btn-lang').forEach(el => el.classList.remove('active'));
            
            // Show selected
            const content = document.getElementById('content-' + code);
            if (content) {
                content.classList.add('active');
                if (content.getAttribute('dir') === 'rtl') {
                    document.body.style.direction = 'rtl';
                } else {
                    document.body.style.direction = 'ltr';
                }
            }
            
            const btn = document.getElementById('btn-' + code);
            if (btn) btn.classList.add('active');
        }

        // Init
        setLang('es');
    </script>
</body>
</html>
`;

let sectionsHtml = '';

languages.forEach(lang => {
    const filePath = path.join(__dirname, lang.file);
    if (fs.existsSync(filePath)) {
        const rawContent = fs.readFileSync(filePath, 'utf8');
        const parsedContent = parseMarkdown(rawContent);
        const dirAttr = lang.dir ? `dir="${lang.dir}"` : '';
        sectionsHtml += `<div id="content-${lang.code}" class="content-section" ${dirAttr}>${parsedContent}</div>`;
        console.log(`Processed ${lang.name}`);
    } else {
        console.warn(`File missing for ${lang.name}: ${lang.file}`);
    }
});

const finalHtml = template(sectionsHtml, JSON.stringify(imageCache));

fs.writeFileSync(path.join(__dirname, 'PRESENTACION_PLATAFORMA_MULTILINGUAL.html'), finalHtml);
console.log('Generated PRESENTACION_PLATAFORMA_MULTILINGUAL.html');
