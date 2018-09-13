'use strict';
exports.register = function(plugin, options, next) {
    const Controllers = {
        erroreport: {
            errorReported: require('../controllers/erroreport/errorReported')
        }
    };
    plugin.route([{
        method: 'GET',
        path: '/crash',
        config: Controllers.erroreport.errorReported.showCrashReport
    }, {
        method: 'GET',
        path: '/report/status/{reportId}/{currentStatus}',
        config: Controllers.erroreport.errorReported.changeErrorStatus
    }, {
        method: 'GET',
        path: '/report_filter',
        config: Controllers.erroreport.errorReported.filter
    }, {
        method: 'GET',
        path: '/generateCrash',
        config: Controllers.erroreport.errorReported.insertIntoCrash
    }, {
        method: 'POST',
        path: '/report',
        config: Controllers.erroreport.errorReported.report
    }]);
    next();
};
exports.register.attributes = {
    name: 'errorReport_routes',
    version: require('../../package.json').version
};
