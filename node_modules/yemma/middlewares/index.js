module.exports = app => init(app);

function init(app) {
    require('./cors')(app);
    require('./getIP')(app);
    require('./logger')(app);
    require('./policies')(app);

    app.middlewares = {
        bodyParser: require('body-parser'),
        validateIssuer: require('./validateIssuer')(app)
    };
}
