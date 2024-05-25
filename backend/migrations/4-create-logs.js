'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Logs', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        collate: 'SQL_Latin1_General_CP1_CS_AS', // Configura la colación como case sensitive
        charset: 'utf8' // Define el conjunto de caracteres de la columna
      },
      editorName: {
        type: Sequelize.STRING,
        allowNull: false,
        collate: 'SQL_Latin1_General_CP1_CS_AS',
        charset: 'utf8'
      },
      producerId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        collate: 'SQL_Latin1_General_CP1_CS_AS',
        charset: 'utf8'
      },
      producerIdentification: {
        type: Sequelize.STRING,
        collate: 'SQL_Latin1_General_CP1_CS_AS',
        charset: 'utf8'
      },
      producerName: {
        allowNull: false,
        type: Sequelize.STRING,
        collate: 'SQL_Latin1_General_CP1_CS_AS',
        charset: 'utf8'
      },
      process: {
        allowNull: false,
        type: Sequelize.STRING,
        collate: 'SQL_Latin1_General_CP1_CS_AS',
        charset: 'utf8'
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
    await queryInterface.dropTable('Logs');
  }
};
