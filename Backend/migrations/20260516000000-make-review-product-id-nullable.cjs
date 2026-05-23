'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Reviews', 'reviews_ibfk_2');

    await queryInterface.changeColumn('Reviews', 'product_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
    });

    await queryInterface.addConstraint('Reviews', {
      fields: ['product_id'],
      type: 'foreign key',
      name: 'reviews_ibfk_2',
      references: {
        table: 'Products',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Reviews', 'reviews_ibfk_2');

    await queryInterface.changeColumn('Reviews', 'product_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    await queryInterface.addConstraint('Reviews', {
      fields: ['product_id'],
      type: 'foreign key',
      name: 'reviews_ibfk_2',
      references: {
        table: 'Products',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },
};
