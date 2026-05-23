import { PromoCode, User } from "../models/db.js";


export const createPromocode = async (req, res) => {
    try {
        const { code, description, discount } = req.body;
        if (!code || !discount) return res.status(400).send({ err: "Missing required fields" });

        const exist = await PromoCode.findOne({ where: { code } });
        if (exist) return res.status(400).send({ err: "Promocode already exists" });

        const promocode = await PromoCode.create({ code, description, discount });
        if (!promocode) return res.status(400).send({ err: "Can't create promocode" });

        return res.status(201).send({ promocode });
    } catch (err) {
        return res.status(400).send({ err: err.message });
    }
}


export const deletePromocode = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).send({ err: "Missing id" });

        const deleted = await PromoCode.destroy({ where: { id } });
        if (!deleted) return res.status(404).send({ err: "Promocode not found" });

        return res.status(200).send({ message: "Promocode deleted successfully" });
    } catch (err) {
        return res.status(400).send({ err: err.message });
    }
}


export const listPromocodes = async (req, res) => {
    try {
        const promocodes = await PromoCode.findAll();
        return res.status(200).send({ promocodes });
    } catch (err) {
        return res.status(400).send({ err: err.message });
    }
}


export const updatePromocode = async (req, res) => {
    try {
        const { code, description, discount } = req.body;
        const { id } = req.params;
        const data = {};

        if (!id) return res.status(400).send({ err: "Missing id" });
        if (code) data.code = code;
        if (description) data.description = description;
        if (discount) data.discount = discount;

        const promocode = await PromoCode.update(data, { where: { id } });
        if (!promocode) return res.status(400).send({ err: "Can't update promocode" });

        return res.status(200).send({ message: "Promocode updated successfully" });
    } catch (err) {
        return res.status(400).send({ err: err.message });
    }
}


// مرة واحدة لكل يوزر
export const applyPromocode = async (req, res) => {
    try {
        const user = req.user;
        const { code } = req.body;
        if (!code) return res.status(400).send({ err: "Missing code" });

        // هل الكود موجود؟
        const promocode = await PromoCode.findOne({ where: { code } });
        if (!promocode) return res.status(404).send({ err: "Promocode not valid" });

        // هل اليوزر استخدم الكود قبل كده؟
        const alreadyUsed = await promocode.hasUser(user.id);
        if (alreadyUsed) return res.status(400).send({ err: "You have already used this promocode" });

        // سجّل الاستخدام — هيتشال تلقائياً لما الأوردر يتعمل عن طريق removePromocodeFromUser
        await promocode.addUser(user.id);

        return res.status(200).send({ promocode });
    } catch (err) {
        return res.status(400).send({ err: err.message });
    }
}


export const sendPromocodeToUsers = async (req, res) => {
    try {
        const { promocode_id, users } = req.body;

        const promocode = await PromoCode.findByPk(promocode_id);
        if (!promocode) return res.status(404).send({ err: "Promocode not found" });

        await promocode.addUsers(users);
        return res.status(200).send({ message: "Promocode sent to users" });
    } catch (err) {
        return res.status(400).send({ err: err.message });
    }
}