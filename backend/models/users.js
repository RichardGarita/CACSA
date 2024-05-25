const { DataTypes } = require('sequelize');
const sequelize = require('../utils/sequelize'); // Importa la instancia de Sequelize
const {encrypt, decrypt} = require('../utils/encryption');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value) {
      this.setDataValue('password', encrypt(value));
    }
  },
  admin: {
    allowNull: false,
    type: DataTypes.BOOLEAN
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
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = encrypt(user.password);
      }
    }
  }
});

User.prototype.validatePassword = async function(password) {
  var decryptedPasswd = decrypt(this.password);
  return decryptedPasswd === password;
};

module.exports = User;
