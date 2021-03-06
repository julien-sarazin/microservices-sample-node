const YemmaDiscovery = require('yemma-discovery');
const express = require('express');
const morgan = require('morgan');
const server = express();

server
    .use((req, res, next) => {
        return req.header('access-token') && req.header('access-token') === process.env.ACCESS_TOKEN
            ? next()
            : res.status(403).send({reason: 'invalid.issuer'})
    })
    .use(morgan('tiny'))
    .get('/', (req, res, next) => res.send(`${process.env.REALM} works`))
    .get('/info', (req, res, next) => res.send(process.env));

server
    .listen(process.env.PORT, () => console.log('server listening on port ', process.env.PORT));

new YemmaDiscovery();

