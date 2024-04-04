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
      userName: {
        type: Sequelize.STRING,
        collate: 'SQL_Latin1_General_CP1_CS_AS', // Configura la colación como case sensitive
        charset: 'utf8' // Define el conjunto de caracteres de la columna
      },
      password: {
        type: Sequelize.STRING,
        collate: 'SQL_Latin1_General_CP1_CS_AS', // Configura la colación como case sensitive
        charset: 'utf8' // Define el conjunto de caracteres de la columna
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
