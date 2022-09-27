const boom = require('@hapi/boom');

const { models } = require('./../libs/sequelize');

class SaleService {
    constructor(){}

    async getAllSales() {
        const sales = await models.Sale.findAll();
        return sales
    }

    async getOneSale(saleId) {
        /* Should include the products in the future */
        const sale = await models.Sale.findByPk(saleId, {
            include: ['products']
        });
        return sale
    }

    async createSale(data, userId) {
        const sale = await models.Sale.create({
            total: 0.1,
            userId
        })
        const prices = []
        const items = []
        for (const item of data.items ) {
            
            const product = await models.Product.findByPk(item.productId);
            if(product) {
                item.unitPrice = product.price
                item.TotalUnit = item.unitPrice * item.amount
                item.saleId = sale.id            
                prices.push(item.TotalUnit)
                items.push(item)
            }
        }
        await models.SaleProduct.bulkCreate(items)
        const total = prices.reduce((prevValue, currentValue) => prevValue + currentValue, 0);
        console.log(total)
        sale.update({
            total
        })
        return {
            message: '¡Compra Registrada Correctamente!'
        }
    }
}

module.exports = SaleService