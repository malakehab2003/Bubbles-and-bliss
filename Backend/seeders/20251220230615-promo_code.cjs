'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'PromoCodes',
      [
        {
          code: 'WELCOME10',
          description: '10% discount for new users',
          discount: 10.0,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          code: 'SAVE15',
          description: 'Save 15% on your order',
          discount: 15.0,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          code: 'SUMMER20',
          description: 'Summer offer 20% off',
          discount: 20.0,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          code: 'WINTER25',
          description: 'Winter sale 25% discount',
          discount: 25.0,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          code: 'FLASH5',
          description: 'Flash sale 5% off',
          discount: 5.0,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          code: 'BLACKFRIDAY30',
          description: 'Black Friday 30% discount',
          discount: 30.0,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          code: 'NEWYEAR20',
          description: 'New Year offer 20% off',
          discount: 20.0,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          code: 'VIP50',
          description: 'VIP exclusive 50% discount',
          discount: 50.0,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          code: 'STUDENT12',
          description: 'Student discount 12%',
          discount: 12.0,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          code: 'FREESHIP',
          description: 'Free shipping equivalent discount',
          discount: 7.5,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('PromoCodes', null, {});
  },
};
