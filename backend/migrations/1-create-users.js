'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        collate: 'SQL_Latin1_General_CP1_CS_AS', // Configura la colación como case sensitive
        charset: 'utf8' // Define el conjunto de caracteres de la columna
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        collate: 'SQL_Latin1_General_CP1_CS_AS', // Configura la colación como case sensitive
        charset: 'utf8' // Define el conjunto de caracteres de la columna
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING,
        collate: 'SQL_Latin1_General_CP1_CS_AS', // Configura la colación como case sensitive
        charset: 'utf8' // Define el conjunto de caracteres de la columna
      },
      admin: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      temp: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};
