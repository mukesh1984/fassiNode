const _ = require('lodash');
const debug = require('debug')('app:requestValidatorMiddleware');
module.exports = (schema) => {
    return (req, res, next) => {
        const params = _.merge(req.params, req.query, req.body);
        const valid = schema.validate(params);
        req.validatedParams = valid.value;

        if (valid.error) {
            debug(valid.error.message);
            return res.status(400).json({ status: false, message: valid.error.message });
        }
        next();
    };
};