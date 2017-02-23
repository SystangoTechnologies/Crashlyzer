'use strict';

exports.register = function(plugin, options, next) {

    const Controllers = {
        dashboard: {
            dashboard: require('../controllers/dashboard/dashboard'),
            alias: require('../controllers/dashboard/alias')
        }
    };

    plugin.route([

        // Dashboard Routes
        {
            method: 'GET',
            path: '/dashboard',
            config: Controllers.dashboard.dashboard.showDashboard
        }, {
            method: 'GET',
            path: '/alias',
            config: Controllers.dashboard.alias.showAlias
        }
    ]);

    next();
};

exports.register.attributes = {
    name: 'dashboard_routes',
    version: require('../../package.json').version
};