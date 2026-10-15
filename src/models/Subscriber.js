const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const crypto = require('crypto');

const Subscriber = sequelize.define('Subscriber', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  unsubscribeToken: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: () => crypto.randomBytes(32).toString('hex'),
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'subscribers',
});

module.exports = Subscriber;
