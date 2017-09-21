const gateway = require('chappai');

gateway
    .on(gateway.events.started, app => console.log('Gateway started on port', app.settings.port))
    .start();

