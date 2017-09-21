const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

module.exports = app => {
    let timeoutId = null;
    return mongoConnect(app);

    function mongoConnect() {
        return mongoose
            .connect(app.settings.db.uri, { useMongoClient: true })
            .then(() => clearTimeout(timeoutId))
            .then(() => console.log(`Yemma connected to ${app.settings.db.uri}.`))
            .catch((err) => {
                console.error(`Connection to ${app.settings.db.uri} failed. \n${err}. \nRetrying...`);
                timeoutId = setTimeout(mongoConnect, 5000);
            });
    }
};
