'use strict';
const { DataTypes } = require('sequelize');

const { SALE_TABLE } = require('./../models/sale.model');

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn(SALE_TABLE, 'saleDate', 'sale_date', {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
      field: 'sale_date'
    });
    
    await queryInterface.changeColumn(SALE_TABLE, 'total', {
      type: Sequelize.DataTypes.FLOAT,
      allowNull: false,
    });

  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.renameColumn(SALE_TABLE, 'sale_date', 'saleDate', {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW
    });

    await queryInterface.changeColumn(SALE_TABLE, 'total', {
      type: DataTypes.INTEGER,
      allowNull: false
    })
  }
};
