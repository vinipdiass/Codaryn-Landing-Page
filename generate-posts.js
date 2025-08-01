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


function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, function (c) {
    return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'})[c];
  });
}

function renderTemplate(post) {
  let html = template;
  // SEO tags
  const title = post.titulo ? `${escapeHtml(post.titulo)} | Codaryn Tecnologia` : 'Blog Codaryn';
  const description = post.descricao ? escapeHtml(post.descricao) : 'Conteúdo sobre tecnologia, automação e inovação.';
  // Gera keywords automáticas a partir do título e descrição
  let keywords = '';
  if (post.titulo && post.descricao) {
    keywords = post.titulo.split(/\s|,|\./).concat(post.descricao.split(/\s|,|\./)).filter(w => w.length > 3).map(w => w.toLowerCase()).filter((v,i,a)=>a.indexOf(v)===i).join(', ');
  } else {
    keywords = 'tecnologia, automação, inovação, codaryn, blog';
  }
  const image = post.imagem ? `https://codaryn.com/${post.imagem.replace(/^\.\.?\//,'')}` : 'https://codaryn.com/images/images/logo-banner.png';
  const url = `https://codaryn.com/posts/${post.slug}.html`;

  // Substitui SEO no <head>
  html = html.replace(/<title>.*?<\/title>/i, `<title>${title}</title>`);
  html = html.replace(/<meta name="description" content=".*?">/i, `<meta name="description" content="${description}">`);
  html = html.replace(/<meta name="keywords" content=".*?">/i, `<meta name="keywords" content="${keywords}">`);
  html = html.replace(/<meta property="og:title" content=".*?">/i, `<meta property="og:title" content="${title}">`);
  html = html.replace(/<meta property="og:description" content=".*?">/i, `<meta property="og:description" content="${description}">`);
  html = html.replace(/<meta property="og:image" content=".*?">/i, `<meta property="og:image" content="${image}">`);
  html = html.replace(/<meta property="og:url" content=".*?">/i, `<meta property="og:url" content="${url}">`);
  html = html.replace(/<meta name="twitter:title" content=".*?">/i, `<meta name="twitter:title" content="${title}">`);
  html = html.replace(/<meta name="twitter:description" content=".*?">/i, `<meta name="twitter:description" content="${description}">`);
  html = html.replace(/<meta name="twitter:image" content=".*?">/i, `<meta name="twitter:image" content="${image}">`);

  // Adiciona o script do Google AdSense apenas em posts do blog (não em páginas de contato, etc)
  // Critério: se o slug não for "contato" ou "contact" ou "fale-conosco" ou "faleconosco"
  const slug = (post.slug || '').toLowerCase();
  const isBlogPost = !['contato','contact','fale-conosco','faleconosco'].includes(slug);
  if (isBlogPost) {
    const adsenseScript = `\n<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5769194392145862" crossorigin="anonymous"></script>\n`;
    html = html.replace(/<\/head>/i, adsenseScript + '</head>');
  }

  // Substitui variáveis do post normalmente
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
