const express = require('express');
const dataCollectionController = require('./modules/data-collection/data-collection.controller');

const app = express();

app.use(express.json());

app.use('/data-collection', dataCollectionController);

app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        message: 'TJ Scrap Analysis API',
        endpoints: {
            collection: '/data-collection',
            summary: '/data-collection/summary',
            analysis: '/data-collection/analyze',
        },
    });
});

app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'tj-scrap-analysis',
        timestamp: new Date().toISOString(),
    });
});

module.exports = app;
