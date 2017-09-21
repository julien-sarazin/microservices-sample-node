module.exports = app => init(app);

function init(app) {
    require('./next')(app);
    require('./connect')(app);
    require('../static/index')(app);
}
