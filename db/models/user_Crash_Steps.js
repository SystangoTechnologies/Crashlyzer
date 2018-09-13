const Sequelize = require('sequelize');


/** * Request Schema */
module.exports = function(sequelize, DataTypes) {
    const userCrashSteps = sequelize.define('User_Crash_Steps', {
        report_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        step_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        actionOn: {
            type: Sequelize.TEXT,
        },
        date: {
            type: Sequelize.DATE,
            defaultValue: DataTypes.allowNull,
            allowNull: true
        },
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT,
        }
    }, {
        timestamps: true
    });

    userCrashSteps.sync({ force: false }).then(() => {
        // Table created       
        return true;
    });
    return userCrashSteps;
};