'use strict';
const mysql = require('../../../lib/mysql');
const Joi = require('joi');
const Boom = require('boom');
const Crypto = require('crypto');

exports.showForm = {
    description: 'Returns the signup page',
    auth: {
        mode: 'try',
        strategy: 'standard'
    },
    handler: function(request, reply) {
        if (request.auth.isAuthenticated) {
            return reply.redirect('/crash');
        }
        reply.view('auth/signup');
    },
    tags: ['api'] //swagger documentation
};
exports.postForm = {
    description: 'Submit the signup page',
    auth: {
        mode: 'try',
        strategy: 'standard'
    },
    validate: {
        payload: {
            name: Joi.string().required(),
            password: Joi.string().min(6).max(20).required(),
            verify: Joi.string().required(),
            email: Joi.string().email().required()
        },
        failAction: function(request, reply, source, error) {
            var user = {
                name: request.payload.name,
                email: request.payload.email
            };
            request.cookieAuth.set(user);
            request.yar.flash('error', error.data.details[0].message);
            return reply.redirect('/signup');
        }
    },
    handler: function(request, reply) {
        var user = {
            name: request.payload.name,
            email: request.payload.email
        };
        request.cookieAuth.set(user);
        if (request.payload.password !== request.payload.verify) {
            request.cookieAuth.set(user);
            request.yar.flash('error', 'Password does not match');
            return reply.redirect('/signup');
        }
        save(request, reply);
    },
    tags: ['api'] //swagger documentation
};

function save(request, reply) {
    mysql.getConnection(function(err, connection) {
        if (err) {
            connection.release();
            request.yar.flash('error', 'An internal server error occurred');
            return reply.redirect('/signup');
        }
        connection.query('select * from Web_App_Users where email=? ', request.payload.email, function(err, rows) {
            if (rows.length) {
                request.yar.flash('error', 'Email already exists.');
                return reply.redirect('/signup');
            } else {
                if (request.payload.password && request.payload.password.length >= 6) {
                    var password = new Buffer(request.payload.password).toString('base64');
                    insertUserDetails(request, reply, password);
                }
            }
            if (err) {
                request.yar.flash('error', 'An internal server error occurred in save');
                return reply.redirect('/signup');
            }
        });
        connection.release();
    });
}

function insertUserDetails(request, reply, password) {
    var num = Math.floor(Math.random() * 90000) + 10000;
    mysql.getConnection(function(err, connection) {
        if (err) {
            connection.release();
            request.yar.flash('error', 'An internal server error occurred');
            return reply.redirect('/signup');
        }
        connection.query('insert into Web_App_Users(`user_id`,`name`,`email`,`password`) VALUES(?,?,?,?)', [num, request.payload.name, request.payload.email, password], function(err, rows) {
            if (err) {
                request.yar.flash('error', 'An internal server error occurred in insertUserDetails');
                return reply.redirect('/signup');
            } else {
                var user = {
                    name: request.payload.name,
                    password: password,
                    email: request.payload.email
                };
                request.cookieAuth.set(user);
                reply.redirect('/crash');
            }
        });
        connection.release();
    });
}