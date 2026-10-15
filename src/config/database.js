const { Sequelize } = require('sequelize');
require('dotenv').config();

const dialect = process.env.DB_DIALECT || 'mysql';

const config =
  dialect === 'sqlite'
    ? {
        dialect: 'sqlite',
        storage: process.env.DB_STORAGE || './database.sqlite',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
      }
    : {
        dialect: 'mysql',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT, 10) || 3306,
        database: process.env.DB_NAME || 'mail_manager',
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || '',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
          max: 10,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
      };

const sequelize = new Sequelize({
  ...config,
  define: {
    timestamps: true,
    underscored: true,
  },
});

module.exports = sequelize;
