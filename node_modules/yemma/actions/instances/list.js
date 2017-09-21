const Action = require('idylle').Action;

/**
 * @api {get} /registry/statuses
 * @description Get the list of available instances in the registry
 * @apiGroup Registry
 * @apiVersion 1.0.0
 */
module.exports = (app) => {
    const Instance = app.models.Instance;

    return Action({
        execute: context => Instance
            .find()
            .where(context.criteria.where)
            .skip(context.criteria.skip)
            .limit(context.criteria.limit)
            .sort(context.criteria.sort)
    });
};
