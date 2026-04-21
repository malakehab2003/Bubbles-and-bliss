import { getProducts } from "../utils/product.js";
import { Product } from "../models/db.js";


export const updateProductRate = async (product_id, rate) => {
    const product = await getProducts({ id: product_id }, 1, 0);

    if (!product || product.length === 0) 
        throw new Error("Can't get product");

    const currentProduct = product[0];

    let newRate;

    if (!currentProduct.rate) newRate = rate;
    else newRate = (currentProduct.rate + rate) / 2;

    await Product.update(
        { rate: newRate },
        { where: { id: product_id } }
    );

    return newRate;
};
