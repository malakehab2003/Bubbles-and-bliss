import { ProductImage } from "../models/db.js";
import { validateImageUrl } from "../utils/validateData.js";


export const addProductImageService = async (productId, images_url) => {
    if (!productId || !images_url || !Array.isArray(images_url)) throw new Error ("Missing image url or product id");

    images_url.forEach(url => {
        validateImageUrl(url);
    });

    const imageData = images_url.map(url => ({
        product_id: productId,
        image_url: url,
    }));

    await ProductImage.bulkCreate(imageData);
}


export const returnImageService = async (image_id) => {
    if (!image_id) throw new Error ("Missing image id");

    const image = await ProductImage.findByPk(image_id);

    if (!image) throw new Error ("Can't get image");
    
    return image;
}
