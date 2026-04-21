'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Cart, { foreignKey: 'user_id' });
      User.hasMany(models.Wishlist, { foreignKey: 'user_id' });
      User.hasMany(models.Order, { foreignKey: 'user_id', as: 'order' });
      User.hasMany(models.Address, { foreignKey: 'user_id', as: 'address' });
      User.hasMany(models.Notification, { foreignKey: 'user_id' });
      User.hasMany(models.Item, { foreignKey: 'user_id' });
      User.hasMany(models.Review, { foreignKey: 'user_id', as: 'review' });
      User.hasMany(models.Message, { foreignKey: 'sender_id', as: 'SentMessages' });
      User.hasMany(models.Message, { foreignKey: 'receiver_id', as: 'ReceivedMessages' });
      User.hasMany(models.Comment, { foreignKey: 'user_id', as: 'comments', });

      User.belongsToMany(models.PromoCode, {
        through: 'UserPromoCodes',
        foreignKey: 'user_id',
        otherKey: 'promocode_id',
      });
    }
  }
  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    dob: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    age: {
      type: DataTypes.VIRTUAL,
      get() {
        if (!this.dob) return null;

        const today = new Date()
        const birthDate = new Date(this.dob);

        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
          age--;
        }
        
        return age;
      }
    },

    phone: {
      type: DataTypes.STRING,
      unique: true,
    },

    show_phone_number: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    gender: {
      type: DataTypes.ENUM('male', 'female'),
      allowNull: false,
    },

    last_login: {
      type: DataTypes.DATE,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    role: {
      type: DataTypes.ENUM('user', 'admin'),
      defaultValue: 'user',
    },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  return User;
};