'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Producers', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        collate: 'SQL_Latin1_General_CP1_CS_AS', // Configura la colación como case sensitive
        charset: 'utf8' // Define el conjunto de caracteres de la columna
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
        collate: 'SQL_Latin1_General_CP1_CS_AS', // Configura la colación como case sensitive
        charset: 'utf8' // Define el conjunto de caracteres de la columna
      },
      date: {
        allowNull: false,
        type: Sequelize.DATE
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
    await queryInterface.dropTable('Producers');
  }
};
