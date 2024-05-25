const { DataTypes } = require('sequelize');
const sequelize = require('../utils/sequelize'); // Importa la instancia de Sequelize
const {encrypt, decrypt} = require('../utils/encryption');

const Producer = sequelize.define('Producer', {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
  identification: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
    set(value) {
      this.setDataValue('identification', encrypt(value));
    },
    get() {
      const encryptedValue = this.getDataValue('identification');
      return decrypt(encryptedValue);
    }
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  category: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  fairLocality: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  fair: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  hooks: {
    beforeUpdate: async (producer) => {
      if (producer.changed('identification')) {
        producer.identification = encrypt(producer.identification);
      }
    }
  }
});

module.exports = Producer;
