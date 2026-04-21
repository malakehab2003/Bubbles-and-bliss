import * as service from '../services/reviewService.js';
import { Review } from '../models/db.js';
import { validateImageUrl } from '../utils/validateData.js';


export const createReview = async (req, res) => {
    try {
        const { message, rate, image_url, product_id } = req.body;
        const user = req.user;

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

        if (image_url) {
            validateImageUrl(image_url);
            data.image_url = image_url;
        }
        const review = await Review.create(data)
        
        if (!review) return res.status(400).send({ err: "Can't create review", });

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
