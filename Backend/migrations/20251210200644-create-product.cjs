'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      rate: {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: 0,
      },

      status: {
        type: Sequelize.ENUM('active', 'last item', 'out of stock'),
        allowNull: false,
        defaultValue: 'active',
      },

      price: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },

      colors: {
        type: Sequelize.JSON,
        allowNull: true,
      },

      sizes: {
        type: Sequelize.JSON,
        allowNull: true,
      },

      stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      sale: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      product_category_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'ProductCategories',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      brand_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Brands',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },

      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
        ),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Products');
  },
};
