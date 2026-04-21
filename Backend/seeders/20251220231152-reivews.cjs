'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Reviews',
      [
        {
          image_url: null,
          message: 'Great product, quality exceeded my expectations.',
          rate: 5,
          user_id: 1,
          product_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          image_url: null,
          message: 'Good value for the price.',
          rate: 4,
          user_id: 2,
          product_id: 2,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          image_url: 'https://example.com/review1.jpg',
          message: 'The product is okay but delivery was slow.',
          rate: 3,
          user_id: 3,
          product_id: 3,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          image_url: null,
          message: 'Not satisfied with the quality.',
          rate: 2,
          user_id: 4,
          product_id: 4,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          image_url: 'https://example.com/review2.jpg',
          message: 'Excellent! I would definitely buy again.',
          rate: 5,
          user_id: 5,
          product_id: 5,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          image_url: null,
          message: 'Average experience, nothing special.',
          rate: 3,
          user_id: 1,
          product_id: 6,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          image_url: null,
          message: 'Product matches the description perfectly.',
          rate: 4,
          user_id: 2,
          product_id: 7,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          image_url: 'https://example.com/review3.jpg',
          message: 'Packaging was damaged but the product works fine.',
          rate: 3,
          user_id: 3,
          product_id: 8,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          image_url: null,
          message: 'Terrible experience, not recommended.',
          rate: 1,
          user_id: 4,
          product_id: 9,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          image_url: 'https://example.com/review4.jpg',
          message: 'Very good quality and fast shipping.',
          rate: 5,
          user_id: 5,
          product_id: 10,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Reviews', null, {});
  },
};
