const { Model, DataTypes, Sequelize } = require('sequelize');

const  { PROVIDER_TABLE } = require('./provider.model');
const ORDER_TABLE = 'orders';

const OrderSchema = {
    id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    orderArrive:{
        field: 'order_arrive',
        allowNull: false,
        type: DataTypes.DATEONLY,
        defaultValue: Sequelize.NOW,  
    },
    total: {
        type: DataTypes.DOUBLE,
        allowNull: true,
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
    isPayed: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        field: 'is_payed',
        defaultValue: false,
    }
}

class Order extends Model {

    static associate(models) {
        this.belongsToMany(models.Product, {
            as: 'items',
            through: models.OrderProduct,
            foreignKey : 'orderId',
            otherKey: 'productId'
        });

        this.belongsTo(models.Provider, {as: 'provider'});
    }

    static config(sequelize){
        return {
            sequelize,
            tableName: ORDER_TABLE,
            modelName: 'Order',
            timestamps: false,
        }
    }
}

module.exports = { ORDER_TABLE, OrderSchema, Order };