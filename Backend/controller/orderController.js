import { removePromocodeFromUser } from "../services/promocodeService.js";
import { Order } from "../models/db.js";
import { validateAddressToUser } from "../services/addressService.js";
import * as service from '../services/orderService.js';
import { getAnotherUserService } from "../services/userService.js";
import { sendNotificationsService } from "../services/notificationService.js";

export const createOrder = async (req, res) => {
    try {
        const user = req.user;
        const { ...data } = req.body;
        if (!data.total_price || !data.receive_type || !data.payment_type) return res.status(400).send({ err: "Missing requried fields" });
        if (data.receive_type === 'delivery' && !data.address_id) return res.status(400).send({ err: "Address is requried" });
        if (data.receive_type === 'pickup' && data.address_id) delete data.address_id;
        if (data.address_id) await validateAddressToUser(user.id, data.address_id);
        if (data.promo_code_id) await removePromocodeFromUser(data.promo_code_id, user);
        data.user_id = user.id;
        data.order_status = 'processing';

        const order = await Order.create({
            ...data
        });

        if (!order) return res.status(400).send({ err: "Can't create order" });

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
        const { total_price, order_status, receive_type, payment_type, address_id, promo_code_id } = req.body;

        const orders = await service.getOrders({ id, });
        const currentOrder = orders[0];
        const user = await getAnotherUserService(null, currentOrder.user_id);

        if (total_price) currentOrder.total_price = total_price;
        if (order_status) currentOrder.order_status = order_status;
        if (receive_type) currentOrder.receive_type = receive_type;
        if (payment_type) currentOrder.payment_type = payment_type;
        if (promo_code_id) {
            await removePromocodeFromUser(promo_code_id, user);
            currentOrder.promo_code_id = promo_code_id;
        }
        if (address_id) {
            await validateAddressToUser(user.id, address_id);
            currentOrder.address_id = address_id;
        }

        await currentOrder.save();

        const description = "Your order has updated go and check it";
        const message = "Order update";
        const entity = 'order';
        const entity_id = currentOrder.id;
        await sendNotificationsService([user.id], description, message, entity, entity_id);

        return res.status(200).send({
            message: "Order updated successfully",
            order: currentOrder,
        });
    } catch (err) {
        return res.status(400).send({ err: err.message });
    }
}
