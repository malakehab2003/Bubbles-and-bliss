'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
      Order.belongsTo(models.PromoCode, { foreignKey: 'promocode_id', as: 'promocode' });
      Order.hasMany(models.OrderItem, { foreignKey: 'order_id', as: 'orderitem' });
      Order.belongsTo(models.Government, { foreignKey: "government_id", as: "government" });
      Order.belongsTo(models.City, { foreignKey: "city_id", as: "city" });
    }
  }
  Order.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },

      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      landmark: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      order_status: {
        type: DataTypes.ENUM(
          'processing',
          'shipped',
          'delivered',
          'cancelled'
        ),
        defaultValue: 'processing',
      },
    },
    {
      sequelize,
      modelName: 'Order',
      tableName: 'Orders',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Order;
};