const { Sequelize } = require('sequelize');
const config = require('./config/config.json');

// Obtiene la configuración correspondiente al entorno de la aplicación (development, test, production, etc.)
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Crea la instancia de Sequelize con la configuración obtenida
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  collate: 'SQL_Latin1_General_CP1_CS_AS', // Configura la colación como sensible a mayúsculas y minúsculas
  // Otras opciones de configuración
});

module.exports = sequelize;
