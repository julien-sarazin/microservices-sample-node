module.exports = app => init(app);

function init(app) {
    app.models = {
        Instance: require('./Instance')
    };
}
