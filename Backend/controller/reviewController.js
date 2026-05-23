import * as service from "../services/reviewService.js";
import { Review, Image, User } from "../models/db.js";
import { uploadToCloudinary } from "../utils/uploadPhotos.js";


export const createReview = async (req, res) => {
    try {
        const { message, rate, product_id } = req.body;
        const user = req.user;
        const file = req.file;

        if (!message || !rate)
            return res.status(400).send({ err: "Missing required fields" });

        const data = {
            message,
            rate,
            user_id: user.id,
        };

        if (product_id) {
            await service.updateProductRate(product_id, rate);
            data.product_id = product_id;
        }

        const review = await Review.create(data);
        if (!review) return res.status(400).send({ err: "Can not create review" });

        review.dataValues.user = user.name;

        if (file) {
            const uploaded = await uploadToCloudinary(file.buffer);
            await Image.create({
                url: uploaded.url,
                public_id: uploaded.public_id,
                owner_id: review.id,
                owner_type: "review",
            });
        }

        return res.status(201).send({ message: "Review created successfully", review });
    } catch (err) {
        return res.status(400).send({ err: err.message });
    }
};


export const listReviews = async (req, res) => {
    try {
        const reviews = await Review.findAll({
            order: [["created_at", "DESC"]],
            include: [
                { model: User, as: "user", attributes: ["id", "name"] },
                { model: Image, as: "image", attributes: ["id", "url"] },
            ],
        });
        return res.status(200).send({ reviews });
    } catch (err) {
        return res.status(400).send({ err: err.message });
    }
};


export const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { message, rate } = req.body;
        const user = req.user;

        if (!id) return res.status(400).send({ err: "Missing id" });
        if (!message && !rate) return res.status(400).send({ err: "Nothing to update" });

        const review = await Review.findOne({ where: { id, user_id: user.id } });
        if (!review) return res.status(400).send({ err: "Review not found or unauthorized" });

        if (message) review.message = message;
        if (rate) review.rate = rate;
        await review.save();

        return res.status(200).send({ message: "Review updated successfully", review });
    } catch (err) {
        return res.status(400).send({ err: err.message });
    }
};


export const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;

        if (!id) return res.status(400).send({ err: "Missing id" });

        const review = await Review.findOne({ where: { id, user_id: user.id } });
        if (!review) return res.status(400).send({ err: "Can not delete this review" });

        await review.destroy();
        return res.status(200).send({ message: "Review deleted successfully" });
    } catch (err) {
        return res.status(400).send({ err: err.message });
    }
};


// Admin: يقدر يمسح أي review بغض النظر عن صاحبه
export const adminDeleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).send({ err: "Missing id" });

        const review = await Review.findByPk(id);
        if (!review) return res.status(404).send({ err: "Review not found" });

        await review.destroy();
        return res.status(200).send({ message: "Review deleted successfully" });
    } catch (err) {
        return res.status(400).send({ err: err.message });
    }
};