const Action = require('idylle').Action;

/**
 * @api {post} /registry/unsubscribe
 * @description remove a registry entry from requester IP.
 * @apiGroup Registry
 * @apiVersion 1.0.0
 */
module.exports = (app) => {
    const instances = app.actions.instances;

    return Action({
        execute: context => instances.remove({
            data: {
                ip: context.HTTP.request.ip
            }
        })
            .then(context.noContent)
    });
};
