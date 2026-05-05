import * as service from '../services/reviewService.js';
import { Review, Image } from '../models/db.js';
import { uploadToCloudinary } from '../utils/uploadPhotos.js';


export const createReview = async (req, res) => {
    try {
        const { message, rate, product_id } = req.body;
        const user = req.user;
        const file = req.file;

        if (
            !message ||
            !rate ||
            !product_id
        ) return res.status(400).send({ err: "Missing requried fields", });

        await service.updateProductRate(product_id, rate);

        const data = {
            message,
            rate,
            user_id: user.id,
            product_id,
        };

        const review = await Review.create(data)
        if (!review) return res.status(400).send({ err: "Can't create review", });
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


        return res.status(201).send({
            message: "Review created successfully",
            review,
        })
    } catch (err) {
        return res.status(400).send({ err: err.message, });
    }
}


export const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;

        if (!id) return res.status(400).send({ err: "Missing id", });

        const review = await Review.findOne({
            where: {
                id,
                user_id: user.id,
            }
        });

        if (!review) return res.status(400).send({ err: "Can't delete this review", });

        await review.destroy();

        return res.status(200).send({ message: "Review deleted successfully" });
    } catch (err) {
        return res.status(400).send({ err: err.message, });
    }
}
