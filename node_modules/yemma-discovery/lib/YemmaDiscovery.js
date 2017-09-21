const _ = require('lodash');
const Instance = require('./Instance');
const Request = require('request-promise');

class YemmaDiscovery {

    constructor(options) {
        options = options || {};

        this.heartBeatDelay = options.heartBeatDelay || 3000;
        this.requestModule = options.requestModule || Request;
        this.registry = require('./settings/registry.json');
        this.instance = require('./settings/instance.json');
        this.heartBeatId = null;

        loadFromEnv(this.registry);

        this.heartBeat = (options.heartBeat !== false);
    }

    /**
     *
     * @param value {Boolean}
     */
    set heartBeat(value) {
        if (value)
            this._triggerHeartBeat();
        else
            this._cancelHeartBeat();
    }

    /**
     *
     * @return {Promise.<Instance>}
     */
    next(query) {
        const self = this;

        return getNextNodeFromRegistry()
            .then(config => new Instance(config, this.requestModule))
            .catch(err => (err.statusCode === 304) ? err.response : Promise.reject(err));

        function getNextNodeFromRegistry() {
            return self.requestModule({
                uri: `${self.registry.uri}/registry/next`,
                headers: {
                    'access-token': self.registry.access_token,
                },
                qs: {criteria: JSON.stringify({where: query})},
                json: true
            });
        }
    };

    /**
     *
     * @private
     */
    _triggerHeartBeat() {
        loadFromEnv(this.instance);
        this.heartBeatId = setInterval(() => {
            const options = _.cloneDeep(this.instance.info);
            options.headers = { 'access-token': this.registry.access_token };

            this.requestModule(`${this.registry.uri}/registry/subscribe`, options)
        }, this.heartBeatDelay);
    }

    /**
     *
     * @private
     */
    _cancelHeartBeat() {
        clearInterval(this.heartBeatId);
    }
}

function loadFromEnv(settings) {
    Object.keys(settings).forEach((property) => {
        if (!settings.hasOwnProperty(property))
            return;

        if (typeof settings[property] === 'object')
            return loadFromEnv(settings[property]);

        let setting = null;
        let ignore = false;

        if (typeof settings[property] === 'string') {
            if (settings[property].startsWith('?') || settings[property].startsWith('$')) {
                setting = process.env[settings[property].slice(1)];

                if (settings[property].startsWith('$') && !setting)
                    throw new Error(`missing env property: ${settings[property].slice(1)}`);
            }
            else
                setting = settings[property]

            if (setting)
                settings[property] = setting;
            else
                delete settings[property];
        }
    });
};

module.exports = YemmaDiscovery;