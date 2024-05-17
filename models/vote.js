"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class vote extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  vote.init(
    {
      label: DataTypes.STRING,
      votes: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "vote",
      paranoid: true,
    }
  );
  return vote;
};
