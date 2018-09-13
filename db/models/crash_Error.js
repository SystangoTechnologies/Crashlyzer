const Sequelize = require('sequelize');

/** * Request Schema */
module.exports = function(sequelize, DataTypes) {
    const crashError = sequelize.define('Crash_Error', {
        error_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        error_msg: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        error_stacktrace: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }, {
        timestamps: true,
        freezeTableName: true

    });

    crashError.sync({ force: false }).then(() => {
        // Table created       
        return true;
    });
    return crashError;
};