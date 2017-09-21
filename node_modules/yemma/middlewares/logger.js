module.exports = app => app.server.use(require('morgan')(app.settings.logger));
