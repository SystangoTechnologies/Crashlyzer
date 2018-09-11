'use strict';
const Confidence = require('confidence');
// Confidence criteria
let internals = {
    criteria: {
        env: process.env.NODE_ENV
    }
};
//  Confidence document object
internals.config = {
    $meta: 'App configuration file',
    port: {
        web: {
            $filter: 'env',
            production: process.env.WEB_PORT,
            $default: 8000
        }
    },
    baseUrl: {
        $filter: 'env',
        $meta: 'values should not end in "/"',
        production: 'https://example.com',
        $default: 'http://127.0.0.1:8000'
    },
    mysql: {
        $filter: 'env',
        production: {
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'myuser',
            password: process.env.DB_PASSWORD || 'mysql',
            database: process.env.DB_NAME || 'crashreporter',
            port: process.env.DB_PORT|| 3306,
            connectionLimit: process.env.DB_CONNECTION_LIMIT || 10
        },
        $default: {
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'report',
            port: 3306,
            connectionLimit: 10,
            options: {}
        }
    },
    authCookie: {
        cookieSecret: process.env.COOKIE_SECRET,
        cookieName: 'Basic-auth'
    },
    yarCookie: {
        storeBlank: false,
        cookieOptions: {
            password: process.env.YAR_COOKIE_SECRET,
            isSecure: false
        }
    },
    good: {
        ops: {
            interval: 1000
        },
        reporters: {
            myConsoleReporter: [{
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{
                    log: '*',
                    response: '*'
                }]
            }, {
                module: 'good-console'
            }, 'stdout']
        }
    }
};
internals.store = new Confidence.Store(internals.config);
exports.get = function(key) {
    return internals.store.get(key, internals.criteria);
};
exports.meta = function(key) {
    return internals.store.meta(key, internals.criteria);
};
