'use strict';
const mysql = require('../../../lib/mysql');
const Joi = require('joi');
exports.showSetting = {
    description: 'Returns the User Setting',
    handler: function(request, reply) {
        reply.view('settings/setting');
    },
    tags: ['api'] //swagger documentation
};
exports.changePassword = {
    description: 'Update the User Password',
    auth: {
        mode: 'try',
        strategy: 'standard'
    },
    validate: {
        payload: {
            oldPassword: Joi.string().min(6).max(20).required(),
            newPassword: Joi.string().min(6).max(20).required(),
            confirmNewPassword: Joi.string().min(6).max(20).required()
        },
        failAction: function(request, reply, source, error) {
            request.yar.flash('error', error.data.details[0].message);
            return reply.redirect('/setting');
        }
    },
    handler: function(request, reply) {
        var old_pwd = request.payload.oldPassword;
        var new_pwd = request.payload.newPassword;
        if (request.payload.newPassword !== request.payload.confirmNewPassword) {
            request.yar.flash('error', 'Password does not match');
            return reply.redirect('/setting');
        }
        //verify password from user table
        checkPassword(request, reply, old_pwd, new_pwd);
    },
    tags: ['alias'] //swagger documentation
};

function checkPassword(request, reply, old_pwd, new_pwd) {
    mysql.getConnection(function(err, connection) {
        if (err) {
            connection.release();
            request.yar.flash('error', 'An internal server error occurred');
            return reply.redirect('/setting');
        }
        connection.query('select * from Web_App_Users where email=?', request.auth.credentials.email, function(err, rows) {
            if (err) {
                request.yar.flash('error', 'An internal server error occurred');
                return reply.redirect('/setting');
            }
            if (rows.length) {
                var oldPassword = new Buffer(old_pwd).toString('base64');
                if (rows[0].password === oldPassword) {
                    var newPassword = new Buffer(new_pwd).toString('base64');
                    //save new password
                    savePassword(request, reply, newPassword);
                } else {
                    request.yar.flash('error', 'Invalid current password');
                    return reply.redirect('/setting');
                }
            } else {
                request.yar.flash('error', 'Invalid current password');
                return reply.redirect('/setting');
            }
        });
        connection.release();
    });
}

function savePassword(request, reply, newPassword) {
    mysql.getConnection(function(err, connection) {
        if (err) {
            connection.release();
            request.yar.flash('error', 'An internal server error occurred');
            return reply.redirect('/setting');
        }
        connection.query('update Web_App_Users set password=? where email=?', [newPassword, request.auth.credentials.email], function(err, rows) {
            if (err) {
                request.yar.flash('error', 'An internal server error occurred');
                return reply.redirect('/setting');
            } else {
                request.yar.flash('success', 'Password updated successfully!');
                reply.redirect('/setting');
            }
        });
        connection.release();
    });
}