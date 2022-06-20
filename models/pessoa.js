const Sequelize = require("sequelize");
const redis = require("redis");
const database = require("../database/db");

const Pessoa = database.sequelize.define(
  "pessoa",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    nome: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "pessoa",
  }
);

module.exports = Pessoa;
