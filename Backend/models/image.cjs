'use strict';

const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    static associate(models) {
      // Polymorphic relations handled manually
    }
  }

  Image.init(
    {
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      public_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      owner_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      owner_type: {
        type: DataTypes.ENUM("user", "product", "review"),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Image",
      tableName: "images",
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Image;
};