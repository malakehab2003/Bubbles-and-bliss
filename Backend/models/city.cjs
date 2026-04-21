'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class City extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      City.belongsTo(models.Government, {
        foreignKey: 'government_id',
        as: 'government'
      });

      City.hasMany(models.Item, {
        foreignKey: 'city_id',
        as: 'items'
      });

      City.hasMany(models.Address, { foreignKey: 'city_id', as: 'address' });
    }
  }
  City.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false
      },

      government_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
  }, {
    sequelize,
    modelName: 'City',
    tableName: 'Cities',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return City;
};