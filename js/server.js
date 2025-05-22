// npm i express lowdb nanoid cors

import express from 'express';
import cors from 'cors';
import { JSONFilePreset } from 'lowdb/node';
import { nanoid } from 'nanoid';

const app = express();
app.use(cors());

// Inicializa banco JSON
const db = await JSONFilePreset('counter.json', { clicks: 0 });

// Lista de vendedores
const sellers = [
    'https://wa.me/555181331593', // Vendedor A
    'https://wa.me/5588888888888'  // Vendedor B
];

// Endpoint principal
app.get('/seller', async (_, res) => {
    const idx = db.data.clicks % sellers.length;
    const link = sellers[idx];

    // ✅ Atualiza contador manualmente
    db.data.clicks += 1;
    await db.write();

    console.log(`Enviado para: ${link} | Total de cliques: ${db.data.clicks}`);

    res.json({
        link,
        clicks: db.data.clicks,
        id: nanoid(6)
    });
});

app.listen(3000, () => {
    console.log('API rodando em http://localhost:3000');
});
