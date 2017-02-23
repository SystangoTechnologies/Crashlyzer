'use strict';

exports.register = function(plugin, options, next) {

    const Controllers = {
        users: {
            users: require('../controllers/users/manageUsers'),
        }
    };

    plugin.route([

        // Users Routes
        {
            method: 'GET',
            path: '/users',
            config: Controllers.users.users.showUsers
        },
        {
            method: 'GET',
            path: '/users/action/{email}/{currentStatus}',
            config: Controllers.users.users.changeUserStatus
        }
    ]);

    next();
};

exports.register.attributes = {
    name: 'user_routes',
    version: require('../../package.json').version
};
