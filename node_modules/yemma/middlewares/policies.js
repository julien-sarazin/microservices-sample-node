module.exports = app => app.server.set('trust proxy', () => app.settings.policies.trust);
