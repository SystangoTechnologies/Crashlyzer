'use strict';
const mysql = require('../../../lib/mysql');
const Joi = require('joi');
const Crypto = require('crypto');

exports.showForm = {
    description: 'Returns the login page',
    auth: {
        mode: 'try',
        strategy: 'standard'
    },
    handler: function(request, reply) {
        if (request.auth.isAuthenticated) {
            return reply.redirect('/crash');
        }
        reply.view('auth/login');
    },
    tags: ['api'] //swagger documentation
};
exports.postForm = {
    description: 'Post to the login page',
    auth: {
        mode: 'try',
        strategy: 'standard'
    },
    plugins: {
        crumb: {
            key: 'crumb',
            source: 'payload',
        }
    },
    validate: {
        payload: {
            email: Joi.string().email().required(),
            password: Joi.string().min(6).max(20).required()
        },
        failAction: function(request, reply, source, error) {
            request.yar.flash('error', error.data.details[0].message);
            return reply.redirect('/');
        }
    },
    handler: function(request, reply) {
        if (request.auth.isAuthenticated) {
            return reply.redirect('/crash');
        }
        findByCredentials(request, reply);
    },
    tags: ['api'] //swagger documentation
};

function findByCredentials(request, reply) {
    mysql.getConnection(function(err, connection) {
        if (err) {
            console.log("*********** MySQL Error ***********" + err);
            connection.release();
            request.yar.flash('error', 'An internal server error occurred');
            return reply.redirect('/login');
        }
        connection.query('select * from Web_App_Users where email=? ', request.payload.email.toLowerCase(), function(err, rows) {
            if (err) {
                request.yar.flash('error', 'An internal server error occurred');
                return reply.redirect('/login');
            }
            if (rows.length) {
                if (request.payload.password && request.payload.password.length >= 6) {
                    var password1 = new Buffer(request.payload.password).toString('base64');
                    if (rows[0].password === password1) {
                        var user = {
                            password: password1,
                            email: request.payload.email,
                            name: rows[0].name,
                            dob: rows[0].dob
                        };
                        request.cookieAuth.set(user);
                        return reply.redirect('/crash');
                    } else if (rows[0].password !== password1) {
                        request.yar.flash('error', 'Invalid email address or password');
                        return reply.redirect('/');
                    } else {
                        request.yar.flash('error', 'Your request is pending for approval');
                        return reply.redirect('/');
                    }
                }
            } else {
                request.yar.flash('error', 'Invalid email address or password');
                return reply.redirect('/');
            }
        });
        connection.release();
    });
}