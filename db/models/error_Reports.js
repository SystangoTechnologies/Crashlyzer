const Sequelize = require('sequelize');

/** * Request Schema */
module.exports = function(sequelize, DataTypes) {
    const errorReports = sequelize.define('Error_Reports', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        os_version: {
            type: Sequelize.STRING,
            allowNull: true
        },
        release_version: {
            type: Sequelize.STRING,
            allowNull: true
        },
        platform: {
            type: Sequelize.TEXT
        },
        model: {
            type: Sequelize.TEXT
        },
        error_id: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        manufacturer: {
            type: Sequelize.STRING
        },
        date: {
            type: Sequelize.DATE
        },
        error_type: {
            type: Sequelize.STRING
        },
        status:{
            type: Sequelize.INTEGER,
            defaultValue: 0
        }
    }, {
        timestamps: true,
    });

    errorReports.sync({ force: false }).then(() => {
        // Table created       
        return true;
    });
    return errorReports;
};