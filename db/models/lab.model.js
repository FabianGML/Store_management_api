const { Model, DataTypes, Sequelize } = require('sequelize');

const  { PROVIDER_TABLE } = require('./provider.model');
const LAB_TABLE = 'labs';

const LabSchema = {
    id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
}

class Lab extends Model {
    static associate(models) {
        this.hasMany(models.Product, {
            as: 'products',
            foreignKey: 'labId'
        });
    }

    static config(sequelize){
        return {
            sequelize,
            tableName: LAB_TABLE,
            modelName: 'Lab',
            timestamps: false,
        }
    }
}

module.exports = { LAB_TABLE, LabSchema, Lab };