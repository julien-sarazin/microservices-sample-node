module.exports = app => init(app);

function init(app) {
    app.actions = {
        instances: require('./instances')(app)
    };
}
