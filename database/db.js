require('dotenv').config();

const { Sequelize, DataTypes } = require('sequelize');
const redis = require("redis");
const client = redis.createClient({ url: "redis://localhost:6379" });

const sequelize = new Sequelize(process.env.PG_DATABASE, process.env.PG_USERNAME, process.env.PG_PASSWORD, {
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  dialect: 'postgres'
});

async function conectar() {
  await client.connect();
  return client;
}

module.exports = {
    sequelize,
    conectar 
  }