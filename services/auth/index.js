const YemmaDiscovery = require('yemma-discovery');
const express = require('express');
const morgan = require('morgan');
const server = express();

const jwt = require('jsonwebtoken');

const DB = [
    {
        login: 'user@email.com',
        password: 'password'
    },
    {
        login: 'foo@bar.com',
        password: 'password'
    }
];

const SALT = 'etjlkerntek';


server
    .use((req, res, next) => {
        return req.header('access-token') && req.header('access-token') === process.env.ACCESS_TOKEN
            ? next()
            : res.status(403).send({reason: 'invalid.issuer'})
    })
    .use(morgan('tiny'))
    .get('/',
        (req, res, next) => res.send(`${process.env.REALM} works`))
    .get('/info',
        (req, res, next) => res.send(process.env))
    .get('/authorize',
        (req, res, next) => {
            const encryptedToken = req.header('authorization');
            if (!encryptedToken)
                return res.status(401).send('unauthorized');

            jwt.verify(encryptedToken, SALT, (err, token) => err
                ? res.status(401).send(err)
                : res.send(token)
            )
        })
    .post('/login',
        require('body-parser').json(),
        (req, res, next) => {
            const {login, password} = req.body;
            if (!login || !password)
                return res.status(404).send('not.found');

            const user = DB.find(u => u.login === login && u.password === password)
            if (!user)
                return res.status(404).send('not.found');

            jwt.sign(user, SALT, (err, encryptedToken) => err
                ? res.status(401).send(err)
                : res.send(encryptedToken)
            )
        });

server
    .listen(process.env.PORT, () => console.log('server listening on port ', process.env.PORT));

new YemmaDiscovery();

