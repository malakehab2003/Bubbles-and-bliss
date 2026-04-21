import * as utils from '../utils/product.js';
import { Product } from '../models/db.js';


export const listItemsService = async (filters, page, limit) => {
    const offset = (page - 1) * limit;
    const where = utils.buildWhereFilters(filters);
    
    const products = await utils.getProducts(where, limit, offset);

    return {
        products,
        pagination: {
            total: products.length,
            page,
            limit,
            totalPages: Math.ceil(products.length / limit),
        }
    }
}


export const getProductService = async (id) => {
    if (!id) throw new Error ("Missing id");
    const where = { id, }

    const product = await utils.getProducts(where, 1, 0);

    if (!product) throw new Error ("Product not found");

    return product[0];
}


export const createProductService = async (data) => {
    if (!data) throw new Error ("Missing data");

    const product = Product.create(data);

    if (!product) throw new Error ("Can't create product");

    return product
}


export const updateProductService = async (data) => {
    const product = await Product.findByPk(data.id);
    if (!product) {
        throw new Error('Product not found');
    }

    await product.update(data);

    return product
}
