module.exports = (app) => {
    const router = app.Router();

    router
        .get('/statuses',
            app.middlewares.validateIssuer,
            app.actions.instances.list.expose()
        )

        .post('/subscribe',
            app.middlewares.validateIssuer,
            app.middlewares.bodyParser.json(),
            app.actions.instances.subscribe.expose()
        )

        .post('/unsubscribe',
            app.middlewares.validateIssuer,
            app.actions.instances.unsubscribe.expose()
        )

        .get('/next',
            app.middlewares.validateIssuer,
            app.actions.instances.next.expose()
        );

    app.server.use('/registry', router);
};
