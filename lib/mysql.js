'use strict';
const mysql = require('mysql');
exports.register = function(plugin, options, next) {
    var pool = mysql.createPool({
        connectionLimit: 100,
        host: options.host,
        user: options.user,
        password: options.password,
        database: options.database
    });
    exports.getConnection = function(callback) {
        pool.getConnection(function(err, connection) {
            callback(err, connection);
        });
    };
    pool.on('connection', function(connection) {
        console.log('Connected with threadId: ', connection.threadId);
    });
    pool.on('enqueue', function() {
        console.log('Waiting for available connection slot');
    });
    next();
};
exports.register.attributes = {
    name: 'mysql',
    version: require('../package.json').version
};