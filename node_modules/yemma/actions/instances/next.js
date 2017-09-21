const Action = require('idylle').Action;

module.exports = app => Action({
    execute: (context) => {
        return app.next(context.criteria.where);
    }
});
