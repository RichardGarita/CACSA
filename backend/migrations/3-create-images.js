'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Images', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        collate: 'SQL_Latin1_General_CP1_CS_AS', // Configura la colación como case sensitive
        charset: 'utf8' // Define el conjunto de caracteres de la columna
      },
      producerId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Producers', // name of the target table
          key: 'id' // key in the target table
        },
        onUpdate: 'CASCADE', // update foreign key on referenced key update
        onDelete: 'CASCADE', // delete related rows when the referenced row is deleted
        collate: 'SQL_Latin1_General_CP1_CS_AS',
        charset: 'utf8'
      },
      path: {
        allowNull: false,
        type: Sequelize.STRING,
        collate: 'SQL_Latin1_General_CP1_CS_AS', // Configura la colación como case sensitive
        charset: 'utf8' // Define el conjunto de caracteres de la columna
      },
      role: {
        allowNull: false,
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
    await queryInterface.dropTable('Images');
  }
};
