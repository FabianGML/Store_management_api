const { User, UserSchema } = require('./user.model');
const { Lab, LabSchema } = require('./lab.model');
const { Product, ProductSchema } = require('./product.model');
const { Provider, ProviderSchema } = require('./provider.model');
const { Order, OrderSchema } = require('./order.model');
const { Sale, SaleSchema } = require('./sale.model');
const { OrderProduct, OrderProductSchema } = require('./order-product.model');
const { SaleProduct, SaleProductSchema } = require('./sale-product.model');
const { LabProvider, LabProviderSchema } = require('./lab-provider.model');
const { ProductProvider, ProductProviderSchema } = require('./product-provider.model');


function setupModels(sequelize) {
    User.init(UserSchema, User.config(sequelize));
    Lab.init(LabSchema, Lab.config(sequelize));
    Product.init(ProductSchema, Product.config(sequelize));
    Provider.init(ProviderSchema, Provider.config(sequelize));
    Order.init(OrderSchema, Order.config(sequelize));
    Sale.init(SaleSchema, Sale.config(sequelize));
    OrderProduct.init(OrderProductSchema, OrderProduct.config(sequelize));
    SaleProduct.init(SaleProductSchema, SaleProduct.config(sequelize));
    LabProvider.init(LabProviderSchema, LabProvider.config(sequelize));
    ProductProvider.init(ProductProviderSchema, ProductProvider.config(sequelize));

    Order.associate(sequelize.models);
    Provider.associate(sequelize.models);
    Lab.associate(sequelize.models);
    Product.associate(sequelize.models);
    OrderProduct.associate(sequelize.models);
    ProductProvider.associate(sequelize.models);
    Sale.associate(sequelize.models);
}

module.exports = setupModels;