"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("images", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      url: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      public_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      owner_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      owner_type: {
        type: Sequelize.ENUM("user", "item", "product", "review"),
        allowNull: false,
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
    await queryInterface.dropTable("images");
    await queryInterface.sequelize.query("DROP TYPE IF EXISTS enum_images_owner_type;");
  },
};