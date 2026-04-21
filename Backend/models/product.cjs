'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.Brand, { foreignKey: 'brand_id', as: 'brand' });
      Product.belongsTo(models.ProductCategory, { foreignKey: 'product_category_id', as: 'category' });
      Product.hasMany(models.ProductImage, { foreignKey: 'product_id', as: 'image' });
      Product.hasMany(models.Review, { foreignKey: 'product_id', as: 'review' });
      Product.hasMany(models.Cart, { foreignKey: 'product_id' });
      Product.hasMany(models.Wishlist, { foreignKey: 'product_id' });
      Product.hasMany(models.OrderItem, { foreignKey: 'product_id', as: 'orderitem' });
    }
  }
  Product.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      rate: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },

      status: {
        type: DataTypes.ENUM('active', 'last item', 'out of stock'),
        defaultValue: 'active',
      },

      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },

      colors: {
        type: DataTypes.JSON,
      },

      sizes: {
        type: DataTypes.JSON,
      },

      stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },

      sale: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },

      description: {
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      modelName: 'Product',
      tableName: 'Products',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Product;
};