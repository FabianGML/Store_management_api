const { Model, DataTypes, Sequelize } = require('sequelize');

const  { PROVIDER_TABLE } = require('./provider.model');
const  { LAB_TABLE } = require('./lab.model');

const LAB_PROVIDER_TABLE = 'labs_providers';

const LabProviderSchema = {
    id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    providerId:{
        field: 'provider_id',
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: PROVIDER_TABLE,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },
    labId: {
        field: 'lab_id',
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: LAB_TABLE,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    }
}

class LabProvider extends Model {
    static associate(models) {
        //
    }

    static config(sequelize){
        return {
            sequelize,
            tableName: LAB_PROVIDER_TABLE,
            modelName: 'LabProvider',
            timestamps: false,
        }
    }
}

module.exports = { LAB_PROVIDER_TABLE, LabProviderSchema, LabProvider };