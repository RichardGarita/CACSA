const { Sequelize } = require('sequelize');
require('dotenv').config();
const config = require('../config/config.json');

// Obtiene la configuración correspondiente al entorno de la aplicación (development, test, production, etc.)
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const dialect = env === 'production' ? process.env.SQL_DIALECT : dbConfig.dialect;
const database = env === 'production' ? process.env.SQL_DATABASE : dbConfig.database;
const username = env === 'production' ? process.env.SQL_USERNAME : dbConfig.username;
const password = env === 'production' ? process.env.SQL_PASSWORD : dbConfig.password;
const host = env === 'production' ? process.env.SQL_HOST : dbConfig.host;
const port =  env === 'production' ? process.env.SQL_PORT : dbConfig.port;
const dialectOptions =  env === 'production' ? process.env.SQL_OPTIONS : dbConfig.dialectOptions;
// Crea la instancia de Sequelize con la configuración obtenida
const sequelize = new Sequelize(database, username, password, {
  host: host,
  dialect: dialect,
  port: port,
  dialectOptions: dialectOptions,
  collate: 'SQL_Latin1_General_CP1_CS_AS', // Configura la colación como sensible a mayúsculas y minúsculas
  // Otras opciones de configuración
});

module.exports = sequelize;
