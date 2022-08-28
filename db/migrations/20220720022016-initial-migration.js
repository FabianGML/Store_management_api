'use strict';

const { USER_TABLE } = require('./../models/user.model');
const { LAB_TABLE  } = require('./../models/lab.model');
const { PRODUCT_TABLE } = require('./../models/product.model');
const { PROVIDER_TABLE } = require('./../models/provider.model');
const { ORDER_TABLE } = require('./../models/order.model');
const { SALE_TABLE } = require('./../models/sale.model');
const { ORDER_PRODUCT_TABLE } = require('./../models/order-product.model');
const { SALE_PRODUCT_TABLE } = require('./../models/sale-product.model');
const { LAB_PROVIDER_TABLE } = require('./../models/lab-provider.model');
const { PRODUCT_PROVIDER_TABLE } = require('./../models/product-provider.model');

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(USER_TABLE, {
        id: {
            allowNull: false,
            autoIncrement: true, 
            primaryKey: true,
            type: Sequelize.DataTypes.INTEGER,
        },
        name: {
            allowNull: false,
            type: Sequelize.DataTypes.STRING,
        },
        lastName: {
            allowNull: false,
            type: Sequelize.DataTypes.STRING,
            field: 'last_name',
        },
        role: {
            allowNull: false,
            type: Sequelize.DataTypes.STRING,
            defaultValue: 'seler'
        },
        email: {
            allowNull: false,
            type: Sequelize.DataTypes.STRING,
            unique: true,
        },
        password: {
            allowNull: false,
            type: Sequelize.DataTypes.STRING
        },
        recoverToken: {
            allowNull: true,
            type: Sequelize.DataTypes.STRING,
            field: 'recovery_token',
        }
      });
      await queryInterface.createTable(LAB_TABLE, {
        id: {
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
          type: Sequelize.DataTypes.INTEGER
        },
        name: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false, 
            unique:true
        }
    });
    await queryInterface.createTable(PRODUCT_TABLE, {
        id: {
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            type: Sequelize.DataTypes.INTEGER
        },
        name: {
            allowNull: false ,
            type: Sequelize.DataTypes.STRING,
        },
        price: {
            type: Sequelize.DataTypes.DOUBLE,
            allowNull: false,
        },
        stock: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        line:{
            allowNull: false,
            type: Sequelize.DataTypes.STRING,
        },
        ingredients: {
            allowNull: true,
            type: Sequelize.DataTypes.STRING,
        },
        labId: {
            field: 'lab_id',
            allowNull: false,
            type: Sequelize.DataTypes.INTEGER,
            references: {
                model: LAB_TABLE,
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        },
        description: {
            allowNull: true,
            type: Sequelize.DataTypes.TEXT,
        },
        expiration: {
            allowNull: false,
            type: Sequelize.DataTypes.DATEONLY,
            defaultValue: Sequelize.NOW,
        },
        expiration2: {
            field: 'expiration_2',
            type: Sequelize.DataTypes.DATEONLY,
            allowNull: true,
        },
        userId: {
            field: 'user_id',
            allowNull: false,
            type: Sequelize.DataTypes.INTEGER,
            references: {
                model: USER_TABLE,
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        }
    });
    await queryInterface.createTable(PROVIDER_TABLE, {
        id: {
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            type: Sequelize.DataTypes.INTEGER
        },
        name: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
            unique:true 
        },
        email: {
            allowNull: true,
            type: Sequelize.DataTypes.STRING,
            unique: true,
        },
        phone: {
            allowNull: true,
            type: Sequelize.DataTypes.STRING,
            unique: true,
        },
        phone2: {
            allowNull: true,
            type: Sequelize.DataTypes.STRING,
            unique: true,
            field: 'phone_2'
        }
    });
    await queryInterface.createTable(ORDER_TABLE, {
        id: {
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            type: Sequelize.DataTypes.INTEGER
        },
        orderArrive:{
            field: 'order_arrive',
            allowNull: false,
            type: Sequelize.DataTypes.DATEONLY,
            defaultValue: Sequelize.NOW,  
        },
        total: {
            type: Sequelize.DataTypes.DOUBLE,
            allowNull: true,
        },
        providerId:{
            field: 'provider_id',
            type: Sequelize.DataTypes.INTEGER,
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
                type: Sequelize.DataTypes.BOOLEAN,
                field: 'is_payed',
                defaultValue: false,
        }
    });
    await queryInterface.createTable(SALE_TABLE, {
        id: {
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            type: Sequelize.DataTypes.INTEGER
        },
        total: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
        },
        saleDate: {
            allowNull: false,
            type: Sequelize.DataTypes.DATE,
            defaultValue: Sequelize.NOW,
        },
        userId: {
            field: 'user_id',
            allowNull: false,
            type: Sequelize.DataTypes.INTEGER,
            references: {
                model: USER_TABLE,
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        }
    });
    await queryInterface.createTable(ORDER_PRODUCT_TABLE, {
        id: {
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            type: Sequelize.DataTypes.INTEGER
        },
        amount: {
            allowNull: false,
            type: Sequelize.DataTypes.INTEGER
        },
        orderId: {
            field: 'order_id',
            allowNull: false,
            type: Sequelize.DataTypes.INTEGER,
            references: {
                model: ORDER_TABLE,
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        },
        productId: {
            field: 'product_id',
            allowNull: false,
            type: Sequelize.DataTypes.INTEGER,
            references: {
                model: PRODUCT_TABLE,
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        },
        unitPrice: {
            field: 'unit_price',
            type: Sequelize.DataTypes.DOUBLE,
        },
        totalPrice:{
            field: 'total_price',
            type: Sequelize.DataTypes.DOUBLE,  
        }
        });
        await queryInterface.createTable(SALE_PRODUCT_TABLE, {
        id: {
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            type: Sequelize.DataTypes.INTEGER
        },
        amount: {
            allowNull: false,
            type: Sequelize.DataTypes.INTEGER
        },
        saleId: {
            field: 'sale_id',
            allowNull: false,
            type: Sequelize.DataTypes.INTEGER,
            references: {
                model: SALE_TABLE,
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        },
        productId: {
            field: 'product_id',
            allowNull: false,
            type: Sequelize.DataTypes.INTEGER,
            references: {
                model: PRODUCT_TABLE,
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        },
        unitPrice: {
            field: 'unit_price',
            type: Sequelize.DataTypes.DOUBLE,
        },
        TotalUnit: {
            field: 'total_unit',
            type: Sequelize.DataTypes.DOUBLE,
        }
    });
    await queryInterface.createTable(LAB_PROVIDER_TABLE, {
        id: {
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            type: Sequelize.DataTypes.INTEGER
        },
        providerId:{
            field: 'provider_id',
            type: Sequelize.DataTypes.INTEGER,
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
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: LAB_TABLE,
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        }
    });
    await queryInterface.createTable(PRODUCT_PROVIDER_TABLE, {
        id: {
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            type: Sequelize.DataTypes.INTEGER
        },
        productId: {
            field: 'product_id',
            type: Sequelize.DataTypes.INTEGER,
            references: {
                model: PRODUCT_TABLE,
                key: 'id'
            }
        },
        providerId: {
            field: 'provider_id',
            type: Sequelize.DataTypes.INTEGER,
            references: {
                model: PROVIDER_TABLE,
                key: 'id'
            }
        }
    })
  },

  async down (queryInterface) {
    await queryInterface.dropTable(ORDER_PRODUCT_TABLE);
    await queryInterface.dropTable(SALE_PRODUCT_TABLE);
    await queryInterface.dropTable(PRODUCT_PROVIDER_TABLE);
    await queryInterface.dropTable(PRODUCT_TABLE);
    await queryInterface.dropTable(SALE_TABLE);
    await queryInterface.dropTable(USER_TABLE);
    await queryInterface.dropTable(ORDER_TABLE);
    await queryInterface.dropTable(LAB_PROVIDER_TABLE);
    await queryInterface.dropTable(LAB_TABLE);
    await queryInterface.dropTable(PROVIDER_TABLE);
  }
};
