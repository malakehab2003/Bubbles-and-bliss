'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Wishlists',
      [
        { user_id: 1, product_id: 1, created_at: new Date(), updated_at: new Date() },
        { user_id: 1, product_id: 2, created_at: new Date(), updated_at: new Date() },
        { user_id: 2, product_id: 2, created_at: new Date(), updated_at: new Date() },
        { user_id: 2, product_id: 3, created_at: new Date(), updated_at: new Date() },
        { user_id: 3, product_id: 1, created_at: new Date(), updated_at: new Date() },
        { user_id: 3, product_id: 4, created_at: new Date(), updated_at: new Date() },
        { user_id: 4, product_id: 5, created_at: new Date(), updated_at: new Date() },
        { user_id: 4, product_id: 3, created_at: new Date(), updated_at: new Date() },
        { user_id: 5, product_id: 2, created_at: new Date(), updated_at: new Date() },
        { user_id: 5, product_id: 5, created_at: new Date(), updated_at: new Date() },
        { user_id: 6, product_id: 1, created_at: new Date(), updated_at: new Date() },
        { user_id: 6, product_id: 2, created_at: new Date(), updated_at: new Date() },
        { user_id: 7, product_id: 2, created_at: new Date(), updated_at: new Date() },
        { user_id: 7, product_id: 3, created_at: new Date(), updated_at: new Date() },
        { user_id: 8, product_id: 1, created_at: new Date(), updated_at: new Date() },
        { user_id: 8, product_id: 4, created_at: new Date(), updated_at: new Date() },
        { user_id: 9, product_id: 5, created_at: new Date(), updated_at: new Date() },
        { user_id: 9, product_id: 3, created_at: new Date(), updated_at: new Date() },
        { user_id: 10, product_id: 2, created_at: new Date(), updated_at: new Date() },
        { user_id: 10, product_id: 5, created_at: new Date(), updated_at: new Date() },
        { user_id: 6, product_id: 3, created_at: new Date(), updated_at: new Date() },
        { user_id: 6, product_id: 4, created_at: new Date(), updated_at: new Date() },
        { user_id: 7, product_id: 4, created_at: new Date(), updated_at: new Date() },
        { user_id: 7, product_id: 5, created_at: new Date(), updated_at: new Date() },
        { user_id: 8, product_id: 2, created_at: new Date(), updated_at: new Date() },
        { user_id: 8, product_id: 5, created_at: new Date(), updated_at: new Date() },
        { user_id: 9, product_id: 1, created_at: new Date(), updated_at: new Date() },
        { user_id: 9, product_id: 4, created_at: new Date(), updated_at: new Date() },
        { user_id: 10, product_id: 1, created_at: new Date(), updated_at: new Date() },
        { user_id: 10, product_id: 3, created_at: new Date(), updated_at: new Date() }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Wishlists', null, {});
  },
};
