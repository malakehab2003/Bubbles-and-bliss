import { Image, Product } from "../models/db.js";
import { uploadToCloudinary } from "../utils/uploadPhotos.js";


export const addImagesService = async (owner_id, owner_type, files) => {
    if (!files || files.length === 0) throw new Error ("No images uploaded");

    await validateOwnerExists(owner_id, owner_type);

    const uploadedImages = await Promise.all(
        files.map(file => uploadToCloudinary(file.buffer))
    );

    const imagesToCreate = uploadedImages.map(img => ({
        url: img.url,
        public_id: img.public_id,
        owner_id,
        owner_type,
    }));

    await Image.bulkCreate(imagesToCreate);
}


export const getImageService = async (image_id) => {
    if (!image_id) throw new Error ("Missing image id");

    const image = await Image.findByPk(image_id);
    if (!image) throw new Error ("Can't get image");

    return image;
}

export const validateOwnerExists = async (owner_id, owner_type) => {
    if (!owner_id || !owner_type)
        throw new Error("Missing owner data");

    switch (owner_type) {
        case "item": {
            const item = await Item.findByPk(owner_id);
            if (!item) throw new Error("Item not found");
            return item;
        }

        case "product": {
            const product = await Product.findByPk(owner_id);
            if (!product) throw new Error("Product not found");
            return product;
        }

        default:
            throw new Error("Invalid owner type");
    }
};
