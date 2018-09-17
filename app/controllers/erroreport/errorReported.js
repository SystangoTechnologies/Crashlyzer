'use strict';
const mysql = require('../../../lib/mysql');
const db = require('../../../db/models');
const Joi = require('joi');

exports.showCrashReport = {
    description: 'Return the crash report',
    handler: function (request, reply) {
        mysql.getConnection(function (err, connection) {
            if (err) {
                connection.release();
                request.yar.flash('error', 'An internal server error occurred');
                return reply.redirect('/crashReport');
            }
            connection.query('SELECT er.user_id as user_id, er.id,replace( cr.error_msg,"\'","`") AS errorMsg,date_format(er.created_at, "%d-%m-%Y")as created_at  ,er.os_version,er.release_version,er.platform,er.model,if(er.status=1,"Open","Resolved")as status, GROUP_CONCAT(REPLACE(ucs.description, "\'", "`")SEPARATOR "/") AS steps FROM Error_Reports er LEFT JOIN Crash_Error cr ON er.error_id = cr.error_id LEFT JOIN User_Crash_Steps ucs ON er.id=ucs.report_id Group By er.id order by er.id desc', function (err, rows) {
                if (err) {
                    request.yar.flash('error', 'An internal server error occurred');
                    return reply.redirect('/crash');
                }
                if (rows.length) {
                    reply.view('erroreport/crashReport', {
                        jsonarr: rows
                    });
                } else {
                    request.yar.flash('error', 'No records found');
                    reply.view('erroreport/crashReport', {
                        jsonarr: rows
                    });
                }
            });
            connection.release();
        });
    },
    tags: ['api'] //swagger documentation
};
exports.changeErrorStatus = {
    plugins: {
        crumb: false
    },
    description: 'Change the Error Report Status',
    handler: function (request, reply) {
        var status = request.params.currentStatus;
        var id = request.params.reportId;
        var newStatus = 1;
        var newstat = 'Open';
        if (status === 'Open') {
            newStatus = 0;
            newstat = 'Resolved';
        }
        mysql.getConnection(function (err, connection) {
            if (err) {
                connection.release();
                request.yar.flash('error', 'An internal server error occurred');
                return reply.redirect('/crash');
            }
            connection.query('update Error_Reports set status=? where id=?', [newStatus, id], function (err, rows) {
                if (err) {
                    request.yar.flash('error', 'An internal server error occurred');
                    return reply.redirect('/crash');
                }
                request.yar.flash('success', 'Issue id#' + id + ' is marked as ' + newstat);
                return reply.redirect('/crash');
            });
            connection.release();
        });
    },
    tags: ['api'] //swagger documentation
};

exports.filter = {
    description: 'Get filtered error reports',
    handler: function (request, reply) {
        var status = request.query.status;
        if (!status) {
            request.yar.flash('error', 'An internal server error occurred');
            return reply.redirect('/crash');
        } else {
            getFilteredError(request, reply, status);
        }
    },
    tags: ['api'] //swagger documentation
};

exports.report = {
    description: 'Store Error Reports Information',
    auth: false ,
    validate: {
        payload: {
            user_id: Joi.number().integer(),
            error_type: Joi.string().allow('').optional(),
            report_data: Joi.object({
                User_Device_Information: Joi.object({
                    manufacturer: Joi.string().allow('').optional(),
                    model: Joi.string().allow('').optional(),
                    release_version: Joi.string().allow('').optional(),
                    platform: Joi.string().allow('').optional(),
                    date: Joi.string().allow('').optional(),
                    os_version: Joi.string().allow('').optional()
                }),
                User_Steps: Joi.array().items(
                    Joi.object({
                        methodName: Joi.string().allow('').optional(),
                        class: Joi.string().allow('').optional(),
                        date: Joi.string().allow('').optional(),
                        actionOn: Joi.string().allow('').optional(),
                        description: Joi.string().allow('').optional()
                    })
                    ).min(1).required(),
                    Crash_Point: Joi.object({
                        error_msg: Joi.string().allow('').optional(),
                        error_stacktrace: Joi.string().allow('').optional()
                    })
                }),
            },
        failAction: (request, reply, error) => {

            return reply({ message: "Error :"+error })
        }
    }, 
    handler: async function (request, reply) {
        let transactionObject;
        try {
            let user_id = request.payload.user_id;
            let error_type = request.payload.error_type;
            let User_Device_Information = request.payload.report_data.User_Device_Information;
            let Crash_Point = request.payload.report_data.Crash_Point;
            let User_Steps = request.payload.report_data.User_Steps;

            // Creating Transaction
            transactionObject = await db.sequelize.transaction();

            let crash_error = await db.Crash_Error.create({
                error_msg: Crash_Point.error_msg,
                error_stacktrace: Crash_Point.error_stacktrace,
            }, { transaction: transactionObject });

            let error_reports = await db.Error_Reports.create({
                user_id: user_id,
                error_type: error_type,
                os_version: User_Device_Information.os_version,
                release_version: User_Device_Information.release_version,
                platform: User_Device_Information.platform,
                model: User_Device_Information.model,
                error_id: crash_error.error_id,
                manufacturer: User_Device_Information.manufacturer,
                date: new Date(User_Device_Information.date),
                status: 0
            }, { transaction: transactionObject })

            let CrashSteps = await db.Crash_Steps.bulkCreate(
                User_Steps.map(user_step => {
                    return {
                        method: user_step.methodName,
                        class: user_step.class
                    }
                }), { transaction: transactionObject }
            );

            let step_ids = CrashSteps.map(crashStep => crashStep.step_id);

            let userCrashReports = await db.User_Crash_Steps.bulkCreate(
                User_Steps.map((user_step, index) => {
                    return {
                        description: user_step.description,
                        report_id: error_reports.id,
                        step_id: step_ids[index],
                        actionOn: user_step.actionOn,
                        date: new Date(user_step.date)
                    }
                }, { transaction: transactionObject })
            );

            // Commit Transaction
            await transactionObject.commit();
            return reply({
                status: 200,
                message: 'Successfully added.'
            });

        } catch (err) {
            console.log(err);
            // Rollback Transaction
            await transactionObject.rollback();
            return reply({
                status: 500,
                message: err.message
            });
        }
    },
    tags: ['api'] //swagger documentation
};

function getFilteredError(request, reply, status) {
    var queryString = '';
    mysql.getConnection(function (err, connection) {
        if (status !== 'Select') {
            queryString = 'SELECT er.user_id as user_id, er.id,replace(cr.error_msg, "\'","`") AS errorMsg,date_format(er.created_at, "%d-%m-%Y")as created_at,er.os_version,er.release_version,er.platform,er.model,if(er.status=1,"Open","Resolved")as status, GROUP_CONCAT(REPLACE(ucs.description, "\'", "`")SEPARATOR "/") AS steps FROM Error_Reports er LEFT JOIN Crash_Error cr ON er.error_id = cr.error_id LEFT JOIN User_Crash_Steps ucs ON er.id=ucs.report_id Group By er.id having status="' + status + '" order by er.id desc ';
        } else {
            queryString = 'SELECT er.user_id as user_id, er.id,replace(cr.error_msg, "\'","`") AS errorMsg,date_format(er.created_at, "%d-%m-%Y")as created_at,er.os_version,er.release_version,er.platform,er.model,if(er.status=1,"Open","Resolved")as status, GROUP_CONCAT(REPLACE(ucs.description, "\'", "`")SEPARATOR "/") AS steps FROM Error_Reports er LEFT JOIN Crash_Error cr ON er.error_id = cr.error_id LEFT JOIN User_Crash_Steps ucs ON er.id=ucs.report_id Group By er.id order by er.id desc';
        }
        if (err) {
            connection.release();
            request.yar.flash('error', 'An internal server pool error occurred');
            return reply.redirect('/crash');
        }
        connection.query(queryString, function (err, rows) {
            if (err) {
                request.yar.flash('error', 'An internal server error occurred' + err);
                return reply.redirect('/crash');
            }
            if (rows.length) {
                reply.view('erroreport/crashReport', {
                    jsonarr: rows,
                    status: status
                });
            } else {
                request.yar.flash('error', 'No records found for selected criteria');
                reply.view('erroreport/crashReport', {
                    jsonarr: rows,
                    status: status
                });
            }
        });
        connection.release();
    });
}
//-----------------------------------------------------------------------------------------------------------
exports.insertIntoCrash = {
    description: 'Post to Crash',
    auth: {
        mode: 'try',
        strategy: 'standard'
    },
    handler: function (request, reply) {

        //get data
        var data = request.query.data;

        //replace special charactors from data
        data = data.replace(/[\/\\']/g, "");
        var report_data = JSON.parse(data).report_data;

        if (request.query.data === undefined) {
            return reply({ status: 0, msg: 'Data is not given' });
        }
        if (report_data.Crash_Point === undefined) {
            return reply({ status: 0, msg: 'Crash point is not given' });
        }
        var error_id = saveCrashError(report_data.Crash_Point, request, reply);
        var report_id = saveErrorReports(report_data.User_Device_Information, error_id, request, reply);
        console.log('report id: ' + report_id);
        var step_id = 0;
        var userData = report_data.User_Steps;
        for (var loop = 0; loop < userData.length; loop++) {
            step_id = checkDuplicateCrashSteps(userData[loop], report_id, request, reply);
        }

        if (report_id) {
            return reply({ status: 1, msg: 'successfully created error report' });
        }
    },
    tags: ['api'] //swagger documentation
}

function saveCrashError(crash_Point, request, reply) {
    var error_id = Math.floor(Math.random() * 90000) + 1000;
    mysql.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            return reply({ status: 0, msg: err });
        }
        connection.query('insert into Crash_Error(`error_id`,`error_msg`,`error_stacktrace`) VALUES(?,?,?)', [error_id, crash_Point.error_msg, crash_Point.error_stacktrace], function (err, rows) {
            if (err) {
                return reply({ status: 0, msg: err });
            }
        });
        connection.release();
    });
    if (error_id === null) {
        request.yar.flash('error', 'An internal server error occurred');
        return reply({ status: 0, msg: 'An internal server error occurred' });
    } else {
        return error_id;
    }
};

function saveErrorReports(User_Device_Information, error_id, request, reply) {
    var report_id = Math.floor(Math.random() * 90000) + 6000;
    var user_id = null;
    //var created_at = Date.now();
    var updated_at = new Date();
    var status = User_Device_Information.status;
    if (status == undefined) {
        status = 0;
    }
    mysql.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            return report_id;
        }
        connection.query('insert into Error_Reports(`id`,`status`,`updated_at`,`os_version`,`release_version`,`platform`,`model`,`error_id`) VALUES(?,?,?,?,?,?,?,?)', [report_id, status, updated_at, User_Device_Information.os_version, User_Device_Information.release_version, User_Device_Information.platform, User_Device_Information.model, error_id], function (err, rows) {
            if (err) {
                return report_id;
            }
        });
        connection.release();
    });
    return report_id;
};

function checkDuplicateCrashSteps(CrashSteps, id, request, reply) {
    var step_id = null;
    mysql.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            request.yar.flash('error', 'An internal server error occurred');
            return step_id;
        }
        connection.query('select step_id from Crash_Steps where method=? and class= ? limit 1', [CrashSteps.method, CrashSteps.class], function (err, rows) {
            if (err) {
                return step_id;
            } else if (rows.length > 0) {
                step_id = rows.step_id;
                saveUserCrashSteps(CrashSteps, id, step_id, request, reply);
            } else {
                saveCrashSteps(CrashSteps, id, request, reply);
            }
        });
        connection.release();
    });
    return step_id;
}

function saveCrashSteps(CrashSteps, id, request, reply) {
    var step_id = Math.floor(Math.random() * 90000) + 9000;
    mysql.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            request.yar.flash('error', 'An internal server error occurred');
            return reply({ status: 0, msg: err });
        }
        connection.query('insert into Crash_Steps(`step_id`,`method`,`class`) VALUES(?,?,?)', [step_id, CrashSteps.methodName, CrashSteps.class], function (err, rows) {
            if (err) {
                request.yar.flash('error', 'An internal server error occurred');
                return reply({ status: 0, msg: err });
            } else {
                saveUserCrashSteps(CrashSteps, id, step_id, request, reply);
            }
        });
        connection.release();
    });
};

function saveUserCrashSteps(CrashSteps, id, step_id, request, reply) {
    var primaryID = Math.floor(Math.random() * 90000) + 7000;
    var UserCrashStepId = null;
    mysql.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            request.yar.flash('error', 'An internal server error occurred');
            return reply({ status: 0, msg: err });
        }
        connection.query('insert into User_Crash_Steps(`report_id`,`step_id`,`actionOn`,`date`,`id`,`description`) VALUES(?,?,?,?,?,?)', [id, step_id, CrashSteps.actionOn, CrashSteps.date, primaryID, CrashSteps.description], function (err, rows) {
            if (err) {
                request.yar.flash('error', 'An internal server error occurred');
            } else {
                UserCrashStepId = rows.id;
            }
        });
        connection.release();
    });
    return UserCrashStepId;
};
