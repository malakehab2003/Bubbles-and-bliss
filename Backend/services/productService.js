import * as utils from '../utils/product.js';
import { Product, Image } from '../models/db.js';
import { uploadToCloudinary } from '../utils/uploadPhotos.js';


export const listItemsService = async (filters, page, limit) => {
    const offset = (page - 1) * limit;
    const where = utils.buildWhereFilters(filters);
    
    const products = await utils.getProducts(where, limit, offset);
    const allProducts = await utils.getProducts(where, 100, 0);

    return {
        products,
        pagination: {
            total: allProducts.length,
            page,
            limit,
            totalPages: Math.ceil(allProducts.length / limit),
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


export const createProductService = async (data, files) => {
    if (!data) throw new Error ("Missing data");

    const product = await Product.create(data);
    if (!product) throw new Error ("Can't create product");
    
    if (files && files.length > 0) {
        const uploadedImages = await Promise.all(
            files.map(file => uploadToCloudinary(file.buffer))
        );

        const imagesToCreate = uploadedImages.map(img => ({
            url: img.url,
            public_id: img.public_id,
            owner_id: product.id,
            owner_type: "product",
        }));

        await Image.bulkCreate(imagesToCreate);
    }

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
