'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Orders',
      [
        {
          total_price: 250.00,
          order_status: 'processing',
          payment_type: 'cash',
          user_id: 1,
          address_id: 1,
          promocode_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          total_price: 1200.50,
          order_status: 'shipped',
          payment_type: 'card',
          user_id: 2,
          address_id: 2,
          promocode_id: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          total_price: 99.99,
          order_status: 'cancelled',
          payment_type: 'cash',
          user_id: 3,
          address_id: null,
          promocode_id: 2,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          total_price: 560.00,
          order_status: 'cancelled',
          payment_type: 'cash',
          user_id: 4,
          address_id: 3,
          promocode_id: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          total_price: 780.75,
          order_status: 'processing',
          payment_type: 'card',
          user_id: 5,
          address_id: 4,
          promocode_id: 3,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          total_price: 300.00,
          order_status: 'delivered',
          payment_type: 'cash',
          user_id: 1,
          address_id: null,
          promocode_id: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          total_price: 1500.00,
          order_status: 'shipped',
          payment_type: 'card',
          user_id: 2,
          address_id: 2,
          promocode_id: 4,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          total_price: 45.00,
          order_status: 'processing',
          payment_type: 'cash',
          user_id: 3,
          address_id: null,
          promocode_id: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          total_price: 999.99,
          order_status: 'delivered',
          payment_type: 'cash',
          user_id: 4,
          address_id: 5,
          promocode_id: 5,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          total_price: 670.40,
          order_status: 'processing',
          payment_type: 'card',
          user_id: 5,
          address_id: 4,
          promocode_id: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Orders', null, {});
  },
};
