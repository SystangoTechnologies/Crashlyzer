const Sequelize = require('sequelize');

/** * Request Schema */
module.exports = function(sequelize, DataTypes) {
    const crashSteps = sequelize.define('Crash_Steps', {
        step_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        method: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        class: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }, {
        timestamps: true,
    });

    crashSteps.sync({ force: false }).then(() => {
        // Table created       
        return true;
    });
    return crashSteps;
};