import { OrderItem, Cart } from "../models/db.js";
import { getOrders } from "../services/orderService.js";
import * as service from '../services/orderItemService.js';


export const listItems = async (req, res) => {
    try {
        const { order_id } = req.params;
        const user = req.user;

        const orderWhere = { id: order_id, user_id: user.id };
        const order = await getOrders(orderWhere);
        if (!order[0]) return res.status(400).send({ err: "Can't get this order" });

        const where = { order_id, };
        const items = await service.getOrderItems(where);

        if (!items) return res.status(400).send({ err: "Can't get items" });

        return res.status(200).send({ items, });
    } catch (err) {
        return res.status(400).send({ err: err.message });
    }
}


export const createItems = async (req, res) => {
    try {
        const user = req.user;

        const where = { id: req.body.order_id, user_id: user.id };
        const order = await getOrders(where);
        if (!order[0]) return res.status(400).send({ err: "Order not found" });

        const cartItems = await Cart.findAll({
            where: { user_id: user.id },
        });

        const orderItemsData = cartItems.map(item => ({
            order_id: order[0].id,
            quantity: item.quantity,
            color: item.color,
            size: item.size,
            product_id: item.product_id,
        }));

        await OrderItem.bulkCreate(orderItemsData);
        await Cart.destroy({ where: { user_id: user.id } });

        return res.status(201).send({
            message: "Items added to order successfully",
            items: orderItemsData
        });
    } catch (err) {
        return res.status(400).send({ err: err.message });
    }
}
