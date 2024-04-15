'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Producers', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        collate: 'SQL_Latin1_General_CP1_CS_AS',
        charset: 'utf8'
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
        collate: 'SQL_Latin1_General_CP1_CS_AS',
        charset: 'utf8'
      },
      category: {
        allowNull: false,
        type: Sequelize.STRING,
        collate: 'SQL_Latin1_General_CP1_CS_AS',
        charset: 'utf8'
      },
      fairLocality: {
        allowNull: true,
        type: Sequelize.STRING,
        collate: 'SQL_Latin1_General_CP1_CS_AS',
        charset: 'utf8'
      },
      date: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      fair: {
        allowNull: false,
        type: Sequelize.BOOLEAN
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
