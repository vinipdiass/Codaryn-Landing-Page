# Codaryn Landing Page

## Como publicar novos posts automaticamente

1. Edite o arquivo `posts/posts.json` e adicione os dados do novo post no formato abaixo:
   
   ```json
   {
     "titulo": "Título do post",
     "slug": "slug-do-post",
     "date": "AAAA-MM-DD",
     "imagem": "../images/blog/nome-da-imagem.webp",
     "descricao": "Descrição curta do post.",
     "principal": "Texto principal do post.",
     "topicos": [
       { "titulo": "Tópico 1", "texto": "Texto do tópico 1." },
       ...
     ]
   }
   ```
   - Gere ou escolha a imagem do post e salve em `images/blog/`.
   - Atualize o campo `imagem` com o caminho correto.
2. Execute o comando abaixo na pasta do projeto para gerar os arquivos HTML dos posts:
   
   ```
   node generate-posts.js
   ```
3. Os arquivos dos posts serão criados/atualizados na pasta `posts/`.
4. Publique os arquivos no seu servidor Hostinger.

---

- O template dos posts é o arquivo `posts/post-exemplo.html`.
- O script de automação é o `generate-posts.js`.
- As imagens dos posts devem ficar em `images/blog/`.
- Não é necessário editar manualmente os arquivos HTML dos posts.

Se precisar de mais automações ou ajustes, peça aqui!
