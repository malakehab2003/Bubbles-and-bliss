'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'ProductImages',
      [
        { image_url: 'https://example.com/product1-1.jpg', product_id: 1, created_at: new Date(), updated_at: new Date() },
        { image_url: 'https://example.com/product1-2.jpg', product_id: 1, created_at: new Date(), updated_at: new Date() },
        { image_url: 'https://example.com/product2-1.jpg', product_id: 2, created_at: new Date(), updated_at: new Date() },
        { image_url: 'https://example.com/product2-2.jpg', product_id: 2, created_at: new Date(), updated_at: new Date() },
        { image_url: 'https://example.com/product3-1.jpg', product_id: 3, created_at: new Date(), updated_at: new Date() },
        { image_url: 'https://example.com/product3-2.jpg', product_id: 3, created_at: new Date(), updated_at: new Date() },
        { image_url: 'https://example.com/product4-1.jpg', product_id: 4, created_at: new Date(), updated_at: new Date() },
        { image_url: 'https://example.com/product4-2.jpg', product_id: 4, created_at: new Date(), updated_at: new Date() },
        { image_url: 'https://example.com/product5-1.jpg', product_id: 5, created_at: new Date(), updated_at: new Date() },
        { image_url: 'https://example.com/product5-2.jpg', product_id: 5, created_at: new Date(), updated_at: new Date() },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ProductImages', null, {});
  },
};
