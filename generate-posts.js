// Node.js script to generate post HTML files from posts.json and post-template.html
const fs = require('fs');
const path = require('path');

const postsPath = path.join(__dirname, 'posts', 'posts.json');
const templatePath = path.join(__dirname, 'posts', 'post-exemplo.html');
const outputDir = path.join(__dirname, 'posts');

// Read posts.json
const posts = JSON.parse(fs.readFileSync(postsPath, 'utf8'));
// Read template
const template = fs.readFileSync(templatePath, 'utf8');

function renderTemplate(post) {
  let html = template;
  Object.keys(post).forEach(key => {
    let value = post[key];
    if (key === 'topicos' && Array.isArray(value)) {
      value = value.map(t => `<li><strong>${t.titulo}:</strong> ${t.texto}</li>`).join('\n');
    }
    const re = new RegExp(`{{${key}}}`, 'g');
    html = html.replace(re, value);
  });
  return html;
}

posts.forEach(post => {
  const html = renderTemplate(post);
  const filename = `${post.slug}.html`;
  const filePath = path.join(outputDir, filename);
  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`Generated: ${filename}`);
});

console.log('All posts generated!');
