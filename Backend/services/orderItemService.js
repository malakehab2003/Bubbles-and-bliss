import { OrderItem, Product, Order } from "../models/db.js";



export const getOrderItems = async (where) => {
    if (!where) throw new Error ("Missing where");

    const orders = await OrderItem.findAll({
        where,
        include: [
            {
                model: Order,
                as: 'order',
            },
            {
                model: Product,
                as: 'product',
            }
        ]
    });

    return orders;
}
