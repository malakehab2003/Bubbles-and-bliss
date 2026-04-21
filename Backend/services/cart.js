import { Cart } from "../models/db.js";


export const checkColorService = (product, color) => {
    if (!product || !color) {
        throw new Error("Missing product_id or color");
    }

    const colors = product.colors;

    if (!colors) throw new Error('Not avaliable color');
    
    const exists = colors.includes(color);
    
    if (!exists) throw new Error("This product don't have this color");
}


export const checkSizeService = (product, size) => {
    if (!product || !size) {
        throw new Error("Missing product_id or size");
    }
    
    const sizes = product.sizes;

    if (!sizes) throw new Error('Not avaliable size');

    const exists = sizes.includes(size);

    if (!exists) throw new Error("This product don't have this size");
}


export const checkQuantityService = (product, quantity) => {
    if (!product || !quantity) throw new Error("Missing product_id or quantity");
        
    if (quantity > product.stock) throw new Error("Can't order this quantity");
}


export const checkUniqueProduct = async (product_id, user_id) => {
    const cart = await Cart.findOne({
        where: {
            user_id,
            product_id,
        }
    });

    if (cart) throw new Error ("Product already exists");
}
