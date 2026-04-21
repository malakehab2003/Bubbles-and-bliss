import cart from "../models/cart.cjs";
import { Cart, Product, ProductImage } from "../models/db.js";
import * as service from '../services/cart.js';
import { getProductService } from "../services/productService.js";



export const listCart = async (req, res) => {
    try {
        const user = req.user;

        const cart = await Cart.findAll({
            where: { user_id: user.id },
            include: [
                {
                    model: Product,
                    as: 'product',
                    attributes: ["name", "price", "sale"],
                    include: [
                        {
                            model: ProductImage,
                            as: 'image',
                        }
                    ]
                }
            ]
        });

        return res.status(200).send({ cart });
    } catch (err) {
        return res.status(400).send({ err: err.message, });
    }
}


export const updateQuantity = async (req, res) => {
    try {
        const { operation, product_id, cart_id } = req.body;

        if (!operation || !product_id || !cart_id) return res.status(400).send({ err: 'Missing required fields' });

        const product = await Product.findByPk(product_id);
        if (!product) return res.status(404).send({ err: 'Product not found' });

        const cart = await Cart.findByPk(cart_id);
        if (!cart) return res.status(404).send({ err: 'Cart item not found' });

        let newQuantity = cart.quantity;

        if (operation === 'add') {
            if (cart.quantity >= product.stock) return res.status(400).send({ err: 'Stock limit reached' });
            newQuantity++;
        } else if (operation === 'sub') {
            if (cart.quantity <= 1) return res.status(400).send({ err: 'Quantity cannot be less than 1' });
            newQuantity--;
        } else return res.status(400).send({ err: 'Invalid operation' });

        cart.quantity = newQuantity;
        await cart.save();

        return res.status(200).send({
            message: 'Quantity updated successfully',
            quantity: cart.quantity,
        });
    } catch (err) {
        return res.status(500).send({ err: err.message });
    }
};


export const addProduct = async (req, res) => {
    try {
        const user = req.user;
        const {
            color,
            size,
            ...data
        } = req.body;

        if (
            !user ||
            !data.product_id ||
            !data.quantity
        ) return res.status(400).send({ err: "Missing requried fields", });

        const product = await getProductService(data.product_id);

        if (!product) return res.status(400).send({ err: "Can't get product", });

        if (color) {
            service.checkColorService(product, color);
            data.color = color;
        }
        if (size) {
            service.checkSizeService(product, size);
            data.size = size
        }
        service.checkQuantityService(product, data.quantity);
        data.user_id = user.id;

        await service.checkUniqueProduct(data.product_id, user.id);

        const cart = await Cart.create(data);

        if (!cart) return res.status(400).send({ err: "Can't add products", });

        return res.status(201).send({
            message: "Product added to cart successfully",
            cart,
        });
    } catch (err) {
        return res.status(400).send({ err: err.message, });
    }
}


export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;

        if (!user || !id) return res.status(400).send({ err: "Missing requried fields", });

        const cart = await Cart.findOne({ where: { user_id: user.id, id, } });

        if (!cart) return res.status(400).send({ err: "Can't delete product from cart", });

        await cart.destroy();

        return res.status(200).send({ message: "product deleted from cart successfully" });
    } catch (err) {
        return res.status(400).send({ err: err.message, });
    }
}