// paginationMiddleware.js

const paginationMiddleware = (req, res, next) => {
    req.page = parseInt(req.query.page) || 1;
    req.pageSize = parseInt(req.query.pageSize) || 1000;
    next();
};

module.exports = paginationMiddleware;