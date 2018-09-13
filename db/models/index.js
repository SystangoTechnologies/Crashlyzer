"use strict";

const fs        = require("fs");
const path      = require("path");
const Sequelize = require("sequelize");
const config    = require("../../config/config").get('/mysql');

const sequelize = new Sequelize(config.database, config.user, config.password, {
    host: config.host,
    port: config.port,
    dialect: 'mysql',
    define: {
      underscored: true
    },
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    }
  })

const db        = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function(file) {
    var model = sequelize["import"](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;


db.Error_Reports.hasMany(db.User_Crash_Steps , {as: 'user_crash_reports'});
db.User_Crash_Steps.belongsTo(db.Error_Reports)

db.Crash_Steps.hasMany(db.User_Crash_Steps);
db.User_Crash_Steps.belongsTo(db.User_Crash_Steps, {as: 'crash_steps'})

module.exports = db;