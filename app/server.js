const express = require('express');
const path = require('path');
const helmet = require('helmet');
const { getProp } = require('./get_data');

const app = express();
const port = 3000;

// Configurar Content Security Policy
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "https://d3js.org"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            imgSrc: ["'self'", 'data:', 'https://upload.wikimedia.org', 'https://encrypted-tbn0.gstatic.com'],
            connectSrc: ["'self'"],
            fontSrc: ["'self'", 'https://fonts.gstatic.com'],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
}));

// Endpoint para obtener los datos
app.get('/getProp', async (req, res) => {
    try {
        const data = await getProp('salud');
        res.json(data);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '../')));
app.use(express.static(path.join(__dirname, '../html')));
app.use(express.static(path.join(__dirname, '../css')));
app.use('/app', express.static(path.join(__dirname, './')));

// Servir index.html en la ruta raíz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});