const { Model, DataTypes, Sequelize } = require('sequelize');

const { USER_TABLE } = require('./user.model');
const SALE_TABLE = 'sales';

const SalesSchema = {
    id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    total: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    saleDate: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
    },
    userId: {
        field: 'user_id',
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: USER_TABLE,
            key: 'id'
        }
    }
}

class Sale extends Model {
    static associate(models) {
        //
    }

    static config(sequelize){
        return {
            sequelize,
            tableName: SALE_TABLE,
            modelName: 'Sale',
            timestamps: false,
        }
    }
}

module.exports = { SALE_TABLE, SalesSchema, Sale };