const { DataTypes } = require('sequelize');
const sequelize = require('../utils/sequelize'); // Importa la instancia de Sequelize
var Producer = require('./producers');

    const Image = sequelize.define('Image', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      producerId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      path: {
        type: DataTypes.STRING,
        allowNull: false
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    });

    Image.belongsTo(Producer, { foreignKey: 'producerId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

    module.exports = Image;
  