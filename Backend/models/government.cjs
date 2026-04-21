'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Government extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Government.hasMany(models.City, {
        foreignKey: 'government_id',
        as: 'city'
      });

      Government.hasMany(models.Address, { foreignKey: 'government_id', as: 'address' });

      Government.hasMany(models.Item, {
        foreignKey: 'government_id',
        as: 'items'
      });
    }
  }
  Government.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
  }, {
    sequelize,
    modelName: 'Government',
      tableName: 'Governments',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
  });
  return Government;
};