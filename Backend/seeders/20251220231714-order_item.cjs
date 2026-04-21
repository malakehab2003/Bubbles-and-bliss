'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'OrderItems',
      [
        {
          quantity: 2,
          color: 'Black',
          size: 'M',
          order_id: 1,
          product_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          quantity: 1,
          color: 'White',
          size: 'L',
          order_id: 1,
          product_id: 2,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          quantity: 3,
          color: 'Red',
          size: 'S',
          order_id: 2,
          product_id: 3,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          quantity: 1,
          color: 'Blue',
          size: 'XL',
          order_id: 2,
          product_id: 4,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          quantity: 4,
          color: null,
          size: null,
          order_id: 3,
          product_id: 5,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          quantity: 2,
          color: 'Green',
          size: 'M',
          order_id: 3,
          product_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          quantity: 1,
          color: 'Black',
          size: 'S',
          order_id: 4,
          product_id: 2,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          quantity: 5,
          color: 'Brown',
          size: 'L',
          order_id: 4,
          product_id: 3,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          quantity: 2,
          color: 'Gray',
          size: 'M',
          order_id: 5,
          product_id: 4,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          quantity: 1,
          color: null,
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
