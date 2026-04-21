import * as service from '../services/productService.js';
import { addProductImageService } from '../services/productImageService.js';
import { Product } from '../models/db.js';
import * as validate from '../utils/validateData.js';


const DEFAULT_LIMIT = 10;


export const listProducts = async (req, res) => {
    try {
        const {
            page = 1,
            ...filters
        } = req.query;

        const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
        const pageSize = DEFAULT_LIMIT;

        const { products, pagination } = await service.listItemsService(filters, pageNumber, pageSize);

        return res.status(200).send({
            products,
            pagination,
        });
    } catch (err) {
        return res.status(400).send({ err: err.message, });
    }
}


export const getProudct = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) return res.status(400).send({ err: "Missing id", });

        const product = await service.getProductService(id);

        if (!product) return res.status(400).send({ err: "Can't get product", });

        return res.status(200).send({ product, });
    } catch (err) {
        return res.status(400).send({ err: err.message, });
    }
}


export const createProduct = async (req, res) => {
    try {
        const { images_url, sale, category_id, rate, ...rest } = req.body;
        const user = req.user;

        if (
            !rest.name ||
            !rest.price ||
            !rest.stock ||
            !rest.description ||
            !category_id ||
            !rest.brand_id ||
            !images_url
        ) return res.status(400).send({ err: "Missing requried fields", });

        if (!sale) sale = 0;
        rest.sale = sale;
        rest.product_category_id = category_id;
        const product = await service.createProductService(rest);

        if (!product) return res.status(400).send({ err: "Can't create product", });

        if (images_url) await addProductImageService(product.id, images_url);

        return res.status(201).send({
            message: "Product created successfully",
            product,
        })
    } catch (err) {
        return res.status(400).send({ err: err.message, });
    }
}


export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) res.status(400).send({ err: "Missing id", });

        await Product.destroy({ where: { id, } });
        
        return res.status(200).send({ message: "Product deleted successfully" });
    } catch (err) {
        return res.status(400).send({ err: err.message, });
    }
}


export const updateProduct = async (req, res) => {
    try {
        const { category_id, rate, ...rest } = req.body;
        const { id } = req.params;
        
        validate.validateId(id);

        const data = {
            ...rest,
            product_category_id: category_id,
            id,
        };

        const product = await service.updateProductService(data);

        if (!product) return res.status(400).send({ err: "Can't update product" });

        return res.status(200).send({
            message: "Product updated Successfully",
            product,
        });
    } catch (err) {
        return res.status(400).send({ err: err.message });
    }
}
