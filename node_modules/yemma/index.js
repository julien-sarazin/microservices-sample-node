const Idylle = require('idylle');

const Core = Idylle.Core;
const registry = new Core();
registry.events = Core.events;

registry.on(Core.events.init.actions,       require('./actions'));
registry.on(Core.events.init.middlewares,   require('./middlewares'));
registry.on(Core.events.init.models,        require('./models'));
registry.on(Core.events.init.routes,        require('./routes'));
registry.on(Core.events.init.settings,      require('./settings'));
registry.on(Core.events.booting,            require('./boot'));

module.exports = registry;

