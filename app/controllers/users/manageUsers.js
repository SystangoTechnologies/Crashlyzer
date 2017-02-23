'use strict';
const mysql = require('../../../lib/mysql');
exports.showUsers = {
    description: 'Returns the Users',
    handler: function(request, reply) {
        getUsers(request, reply);
    },
    tags: ['api'] //swagger documentation
};

function getUsers(request, reply) {
    mysql.getConnection(function(err, connection) {
        if (err) {
            connection.release();
            request.yar.flash('error', 'An internal server error occurred');
            return reply.redirect('/users');
        }
        connection.query('SELECT user_id,email,name,if(is_approved=1,"Approved","Disapproved") as status from Web_App_Users where role="USER"', function(err, rows) {
            if (err) {
                request.yar.flash('error', 'An internal server error occurred');
                return reply.redirect('/users');
            }
            if (rows.length) {
                reply.view('users/manageUsers', {
                    jsonarr: rows
                });
            } else {
                request.yar.flash('error', 'No records found');
                reply.view('users/manageUsers', {
                    jsonarr: rows
                });
            }
        });
        connection.release();
    });
}
exports.changeUserStatus = {
    description: 'Change the User Approvel',
    handler: function(request, reply) {
        var email = request.params.email;
        var status = request.params.currentStatus;
        var newStatus = 1;
        var newstat = 'Activated';
        if (status === 'Approved') {
            newStatus = 0;
            newstat = 'De-activated';
        }
        mysql.getConnection(function(err, connection) {
            if (err) {
                connection.release();
                request.yar.flash('error', 'An internal server error occurred');
                return reply.redirect('/users');
            }
            connection.query('update Web_App_Users set is_approved=? where email=?', [newStatus, email], function(err, rows) {
                if (err) {
                    request.yar.flash('error', 'An internal server error occurred');
                    return reply.redirect('/users');
                }
                request.yar.flash('success', 'User account ' + ' has been ' + newstat);
                reply.redirect('/users');
            });
            connection.release();
        });
    },
    tags: ['api'] //swagger documentation
};