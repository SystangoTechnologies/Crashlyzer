'use strict';
const mysql = require('mysql');
exports.register = function(plugin, options, next) {
    var pool = mysql.createPool({
        connectionLimit: options.connectionLimit,
        host: options.host,
        user: options.user,
        password: options.password,
        port: options.port,
        database: options.database
    });
    console.log("********************************");
    console.log(options);
    console.log("********************************");
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