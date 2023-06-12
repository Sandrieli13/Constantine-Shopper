require('dotenv').config()
const Sequelize = require('sequelize')
const pkg = require('../../package.json')

const databaseName = process.env.DATABASE_URL

const config = {
  logging: console.log
};

if(process.env.LOGGING === 'true'){
  delete config.logging
}


if(process.env.DATABASE_URL){
  config.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false // You can set this to true if you have the CA certificate
    }
  };
}


const db = new Sequelize(
  process.env.DATABASE_URL || `postgres://localhost:5432/${databaseName}`, config)




module.exports = db;
