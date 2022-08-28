const { Model, DataTypes, Sequelize } = require('sequelize');

const PROVIDER_TABLE = 'providers';

const ProviderSchema = {
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
    email: {
        allowNull: true,
        type: DataTypes.STRING,
        unique: true,
    },
    phone: {
        allowNull: true,
        type: DataTypes.STRING,
        unique: true,
    },
    phone2: {
        allowNull: true,
        type: DataTypes.STRING,
        unique: true,
        field: 'phone_2'
    },
}

class Provider extends Model {
    static associate(models) {
        this.belongsToMany(models.Lab, {
            as: 'labsProv',
            through: models.LabProvider, 
            foreignKey: 'providerId',
            otherKey: 'labId'
        });
        
        this.belongsToMany(models.Product, {
            as: 'prodProv',
            through: models.ProductProvider,
            foreignKey: 'providerId',
            otherKey: 'productId'
        })
    }

    static config(sequelize){
        return {
            sequelize,
            tableName: PROVIDER_TABLE,
            modelName: 'Provider',
            timestamps: false,
        }
    }
}

module.exports = { PROVIDER_TABLE, ProviderSchema, Provider };