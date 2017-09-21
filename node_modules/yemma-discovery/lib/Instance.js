let request = null;

class Instance {
    constructor(config, requestModule) {
        this.address = config.address;
        this.accessToken = config.access_token;
        this.port = config.port;

        request = requestModule;
    }

    get uri() {
        return `${this.address}${this.port !== 80 ? `:${this.port}` : ''}`;
    };

    request(path, options) {
        options = options || {};
        options.uri = `${options.protocol || 'http'}://`;
        options.uri += `${this.uri}`;
        options.uri += `${path}`;
        options.method = options.method || 'GET';
        options.json = true;
        options.timeout = options.timeout || 3000;
        options.port = options.port || this.port;
        options.headers = options.headers || {};
        options.headers.host = this.address;
        options.headers['access-token'] = this.accessToken;

        options.qs = options.query;

        return request(options)
            .catch(err => (err.statusCode === 304) ? err.response : Promise.reject(err));
    };
}




module.exports = Instance;

