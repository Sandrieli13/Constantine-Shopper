require('dotenv').config()
const Sequelize = require('sequelize')
const pkg = require('../../package.json')
const { createClient } = require('@supabase/supabase-js');

const databaseName = process.env.DATABASE_URL

const config = {
  logging: true
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



// Supabase configuration
const supabaseUrl = process.env.DATABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = db, supabase;
