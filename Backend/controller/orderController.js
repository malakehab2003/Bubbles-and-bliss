import { removePromocodeFromUser } from "../services/promocodeService.js";
import { Order } from "../models/db.js";
import * as service from '../services/orderService.js';
import { getAnotherUserService } from "../services/userService.js";
import { validatePhone, validateCityId } from "../utils/validateData.js";

export const createOrder = async (req, res) => {
    try {
        const user = req.user;
        const { ...data } = req.body;
        if (!data.total_price || !data.address || !data.phone || !data.government_id || !data.city_id) return res.status(400).send({ err: "Missing requried fields" });
        data.user_id = user.id;
        validatePhone(data.phone);
        await validateCityId(data.city_id, data.government_id);
        data.order_status = 'processing';
        
        const order = await Order.create({
            ...data
        });
        
        if (!order) return res.status(400).send({ err: "Can't create order" });
        if (data.promocode_id) await removePromocodeFromUser(data.promocode_id, user);

        return res.status(201).send({
            message: "Order created successfully",
            order,
        });
    } catch (err) {
        return res.status(400).send({ err: err.message });
    }
}


export const listUserOrders = async (req, res) => {
    try {
        const user = req.user;
        const where = { user_id: user.id }

        const orders = await service.getOrders(where);

        if (!orders) return res.status(400).send({ err: "Can't get orders" });

        return res.status(200).send({ orders, });
    } catch (err) {
        return res.status(400).send({ err: err.message });
    }
}


export const getOrders = async (req, res) => {
    try {
        const { user_id } = req.query;
        let where = {};
        if (user_id) where = { user_id, }

        const orders = await service.getOrders(where);

        if (!orders) return res.status(400).send({ err: "Can't get orders" });

        return res.status(200).send({ orders, });
    } catch (err) {
        return res.status(400).send({ err: err.message });
    }
}


export const getOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;

        if (!id) return res.status(400).send({ err: "Missing id" });
        const where = { id, user_id: user.id };

        const order = await service.getOrders(where);
        if (!order) return res.status(400).send({ err: "Can't get order" });

        return res.status(200).send({
            order: order[0],
        });
    } catch (err) {
        return res.status(400).send({ err: err.message });
    }
}


export const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { total_price, order_status, promocode_id } = req.body;

        const orders = await service.getOrders({ id, });
        const currentOrder = orders[0];
        const user = await getAnotherUserService(null, currentOrder.user_id);

        if (total_price) currentOrder.total_price = total_price;
        if (order_status) currentOrder.order_status = order_status;
        if (promocode_id) {
            await removePromocodeFromUser(promocode_id, user);
            currentOrder.promocode_id = promocode_id;
        }

        await currentOrder.save();

        return res.status(200).send({
            message: "Order updated successfully",
            order: currentOrder,
        });
    } catch (err) {
        return res.status(400).send({ err: err.message });
    }
}
