const { DataTypes } = require('sequelize');
const sequelize = require('../utils/sequelize'); // Importa la instancia de Sequelize
const {encrypt, decrypt} = require('../utils/encryption');

const Log = sequelize.define('Log', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  editorName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  producerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  producerIdentification: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value) {
      this.setDataValue('producerIdentification', encrypt(value));
    },
    get() {
      const encryptedValue = this.getDataValue('producerIdentification');
      if (!encryptedValue)
        return null;
      return decrypt(encryptedValue);
    }
  },
  producerName: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  process: {
    allowNull: false,
    type: DataTypes.STRING,
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

module.exports = Log;
  