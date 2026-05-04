import { Order, User, PromoCode } from "../models/db.js";



export const getOrders = async (where) => {
    if (!where) throw new Error ("Missing where");

    const orders = await Order.findAll({
        where,
        include: [
            {
                model: User,
                as: 'user',
                attributes: ['id', 'name']
            },
            {
                model: PromoCode,
                as: 'promocode',
            },
        ]
    });

    return orders;
}
