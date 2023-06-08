require('dotenv').config()
const Sequelize = require('sequelize')
const pkg = require('../../package.json')

const databaseName = process.env.DATABASE_URL

const config = {
  logging: false
};

if(process.env.LOGGING === 'true'){
  delete config.logging
}

//https://stackoverflow.com/questions/61254851/heroku-postgres-sequelize-no-pg-hba-conf-entry-for-host
if(process.env.DATABASE_URL){
  config.dialectOptions = {
    ssl: {
      rejectUnauthorized: false
    }
  };
}

const db = new Sequelize(
  process.env.DATABASE_URL || `postgres://snackbar_user:zg6xKCu7ZInfrvjYeHO7a0fHg7C1SXMR@dpg-ci0if5hmbg5ffclfhf00-a.ohio-postgres.render.com/snackbar`, config)
module.exports = db
