const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Devis = sequelize.define('Devis', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { isEmail: true },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  company: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  projectType: {
    type: DataTypes.ENUM('site_web', 'application_mobile', 'api', 'design_ui_ux', 'maintenance', 'autre'),
    allowNull: false,
  },
  budget: {
    type: DataTypes.ENUM('moins_500k', '500k_1m', '1m_3m', '3m_plus', 'a_discuter'),
    defaultValue: 'a_discuter',
  },
  deadline: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'in_review', 'accepted', 'rejected'),
    defaultValue: 'pending',
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'devis',
});

module.exports = Devis;
