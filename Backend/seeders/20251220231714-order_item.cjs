'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'OrderItems',
      [
        {
          quantity: 2,
          size: 'M',
          order_id: 1,
          product_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          quantity: 1,
          size: 'L',
          order_id: 1,
          product_id: 2,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          quantity: 3,
          size: 'S',
          order_id: 2,
          product_id: 3,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          quantity: 1,
          size: 'XL',
          order_id: 2,
          product_id: 4,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          quantity: 4,
          size: null,
          order_id: 3,
          product_id: 5,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          quantity: 2,
          size: 'M',
          order_id: 3,
          product_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          quantity: 1,
          size: 'S',
          order_id: 4,
          product_id: 2,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          quantity: 5,
          size: 'L',
          order_id: 4,
          product_id: 3,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          quantity: 2,
          size: 'M',
          order_id: 5,
          product_id: 4,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          quantity: 1,
          size: null,
          order_id: 5,
          product_id: 5,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('OrderItems', null, {});
  },
};
