require('dotenv').config()
Sequelize = require('sequelize')
self = module.exports

var fs = require('fs')
var path = require('path')
var basename = path.basename(__filename)
var Sequelize = require('sequelize')
var config    = require('../config/config.json')[process.env.NODE_ENV]

var db = {};

/**
 * Construct a singleton sequelize object to query the database
 * 
 * @returns {object} - Sequelize object
 */
if(!db.ISequelize){
  sOption = {
      host: config.host,
      port: config.port,
      dialect: config.dialect,
      dialectOptions: config.dialectOptions
  }
  db.Sequelize = Sequelize
  db.ISequelize = new Sequelize(config.database, config.username, config.password,sOption )
  db.ISequelize
    .authenticate()
    .then(()=>{
      console.log(config.host + ' Database Connection has been established successfully.')
    })
    .catch(err => {
      console.log('Failed connection-------------------')
      console.error('Unable to connect to the database:', err)
      console.log('config--------')
      console.log(sOption)
      console.log(config)
    })
//   Load all models fancee
  fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        var model = db.ISequelize ['import'](path.join(__dirname, file));
        db[model.name] = model

    })

  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  })
  module.exports = db
  return db
}