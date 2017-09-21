module.exports = app => ({
    list: require('./list')(app),
    subscribe: require('./subscribe')(app),
    unsubscribe: require('./unsubscribe')(app),
    next: require('./next')(app)
});
