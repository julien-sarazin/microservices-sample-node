const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const TimestampsPlugin = require('mongoose-timestamps');
const request = require('request-promise');

const InstanceSchema = Schema({
    address: {
        type: String,
        required: true,
    },
    port: {
        type: Number,
        required: true
    },
    realm: {
        type: String,
        required: true
    },
    access_token: {
        type: String,
        required: true
    },
    timeout: {
        type: Number,
        require: true,
        default: 3000
    },
    ttl: {
        type: Date,
        default: Date.now,
        index: { expires: '60s' }
    },
    __v: {
        type: Number,
        select: false
    }
});

InstanceSchema.methods.request = function (path, options) {
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
    options.headers['access-token'] = this.access_token;

    options.qs = options.query;

    return request(options)
        .catch(err => (err.statusCode === 304) ? err.response : Promise.reject(err));
};

InstanceSchema.index({ address: 1, port: 1 }, { unique: true });
InstanceSchema.plugin(TimestampsPlugin);

InstanceSchema.virtual('uri').get(function () {
    return `${this.address}${this.port !== 80 ? `:${this.port}` : ''}`;
});

module.exports = mongoose.model('Instance', InstanceSchema);
