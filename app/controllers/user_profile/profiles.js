'use strict';
const mysql = require('../../../lib/mysql');
const Joi = require('joi');
exports.showProfiles = {
    description: 'Returns the User Profile',
    handler: function(request, reply) {
        var user = {
            email: request.auth.credentials.email,
            name: request.auth.credentials.name,
            dob: request.auth.credentials.dob
        };
        reply.view('user_profile/profiles', {
            user: user
        });
    },
    tags: ['api'] //swagger documentation
};
exports.editProfiles = {
    description: 'Edit the User Profile',
    auth: {
        mode: 'try',
        strategy: 'standard'
    },
    validate: {
        payload: {
            name: Joi.string().required(),
        },
        options: {
            allowUnknown: true
        },
        failAction: function(request, reply, source, error) {
            request.yar.flash('error', error.data.details[0].message);
            return reply.redirect('/signup');
        }
    },
    handler: function(request, reply) {
        var name = request.payload.name;
        var dob = request.payload.dob;
        update(request, reply, name, dob);
    },
    tags: ['api'] //swagger documentation
};

function update(request, reply, name, dob) {
    mysql.getConnection(function(err, connection) {
        if (err) {
            connection.release();
            request.yar.flash('error', 'An internal server error occurred');
            return reply.redirect('/profiles');
        }
        connection.query('update Web_App_Users set name=?, dob=? where email=? ', [name, dob, request.params.email], function(err, rows) {
            if (err) {
                request.yar.flash('error', 'An internal server error occurred');
                return reply.redirect('/profiles');
            } else {
                var role = request.auth.credentials.role;
                var user = {
                    email: request.params.email,
                    name: name,
                    dob: dob,
                    role: role
                };
                request.cookieAuth.clear();
                request.cookieAuth.set(user);
                request.yar.flash('success', 'Profile updated successfully!');
                reply.redirect('/profiles', {
                    user: user
                });
            }
        });
        connection.release();
    });
}
exports.deleteProfile = {
    description: 'Delete the User Profile',
    auth: {
        mode: 'try',
        strategy: 'standard'
    },
    validate: {
        failAction: function(request, reply, source, error) {
            request.yar.flash('error', error.data.details[0].message);
            return reply.redirect('/');
        }
    },
    handler: function(request, reply) {
        var email = request.payload.email;
        deleteUser(request, reply, email);
    },
    tags: ['api'] //swagger documentation
};

function deleteUser(request, reply, email) {
    mysql.getConnection(function(err, connection) {
        if (err) {
            connection.release();
            request.yar.flash('error', 'An internal server error occurred');
            return reply.redirect('/');
        }
        connection.query('delete from Web_App_Users where email=? ', [email], function(err, rows) {
            if (err) {
                request.yar.flash('error', 'An internal server error occurred');
                return reply.redirect('/');
            } else {
                request.cookieAuth.clear();
                request.yar.flash('success', 'Your account deleted successfully!');
                reply.redirect('/');
            }
        });
        connection.release();
    });
}