const { Model, DataTypes, Sequelize } = require('sequelize');

const  { USER_TABLE } = require('./user.model');
const  { LAB_TABLE } = require('./lab.model');

const PRODUCT_TABLE = 'products';

const ProductSchema = {
    id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    name: {
        allowNull: false ,
        type: DataTypes.STRING,
    },
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    line:{
        allowNull: false,
        type: DataTypes.STRING,
    },
    ingredients: {
        allowNull: true,
        type: DataTypes.STRING,
    },
    labId: {
        field: 'lab_id',
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: LAB_TABLE,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },
    description: {
        allowNull: true,
        type: DataTypes.TEXT ,
    },
    expiration: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
    },
    expiration2: {
        field: 'expiration_2',
        type: DataTypes.DATE,
        allowNull: true,
    },
    userId: {
        field: 'user_id',
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: USER_TABLE,
            key: 'id'
        }
    },
    
}

class Product extends Model {
    static associate(models){
        this.belongsTo(models.Lab, { as: 'lab' });

    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: PRODUCT_TABLE,
            modelName: 'Product',
            timestamps: false
        }
    }
}

module.exports = { PRODUCT_TABLE, ProductSchema, Product };