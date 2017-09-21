const _ = require('lodash');

class ServiceUnavailableError extends Error {
    constructor(code, message) {
        super(message);
        this.code = code;
    }
}

/**
 * Basic round robin algorithm fetching the oldest awaken instance
 * @param query the query matching the instance to target (generally a subdomain or the first path component)
 */
module.exports = app => {
    app.next = (query) => {
        return app.models.Instance.find()
            .where(query)
            .sort('updated_at')
            .then(i => i.length > 0 ? i : Promise.reject(new ServiceUnavailableError(503, `service.${query.realm}.unavailable`)))
            .then(getFirst)
            .then(update);

        function getFirst(instances) {
            return instances[0];
        }

        function update(instance) {
            return instance.save();
        }
    };
};
