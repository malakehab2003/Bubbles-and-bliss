'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'UserPromoCodes',
      [
        { user_id: 1, promocode_id: 1, created_at: new Date(), updated_at: new Date() },
        { user_id: 1, promocode_id: 2, created_at: new Date(), updated_at: new Date() },
        { user_id: 2, promocode_id: 2, created_at: new Date(), updated_at: new Date() },
        { user_id: 2, promocode_id: 3, created_at: new Date(), updated_at: new Date() },
        { user_id: 3, promocode_id: 1, created_at: new Date(), updated_at: new Date() },
        { user_id: 3, promocode_id: 4, created_at: new Date(), updated_at: new Date() },
        { user_id: 4, promocode_id: 5, created_at: new Date(), updated_at: new Date() },
        { user_id: 4, promocode_id: 3, created_at: new Date(), updated_at: new Date() },
        { user_id: 5, promocode_id: 2, created_at: new Date(), updated_at: new Date() },
        { user_id: 5, promocode_id: 5, created_at: new Date(), updated_at: new Date() },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('UserPromoCodes', null, {});
  },
};
