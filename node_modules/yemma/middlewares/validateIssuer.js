module.exports = app => (req, res, next) => {
    const authorization = req.header('access-token');

    if (!authorization)
        return unauthorized();

    if (authorization !== app.settings.access_token)
        return unauthorized();

    return next();

    function unauthorized() {
        return res.status(401).send({ reason: 'invalid.issuer' });
    }
};

