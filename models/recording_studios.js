'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class recording_studios extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  recording_studios.init({
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    zip_code: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    website: DataTypes.STRING,
    hourly_rate: DataTypes.STRING,
    rate: DataTypes.STRING,
    image: DataTypes.TEXT,
    map: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'recording_studios',
  });
  return recording_studios;
};