import * as service from '../services/imageService.js';
import { deleteFromCloudinary } from "../utils/uploadPhotos.js"


export const deleteImage = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;

        if (!id || !user) return res.status(400).send({ err: "Missing id", });
        
        const image = await service.getImageService(id);
        
        if (!image) return res.status(400).send({ err: "Can't get image", });

        if (image.owner_type === 'user' && image.owner_id !== user.id) return res.status(400).send({ err: "Can't delete image", });

        await deleteFromCloudinary(image.public_id);
        
        await image.destroy();
        
        return res.status(200).send({ message: "Image Deleted Successfully" });
    } catch (err) {
        return res.status(400).send({ err: err.message, });
    }
}


export const addImages = async (req, res) => {
    try {
        const { owner_id, owner_type } = req.body;
        const user = req.user;
        
        if (!owner_id || !req.files || !owner_type|| req.files.length === 0) return res.status(400).send({ err: "Missing data", });

        const allowedTypes = ['product'];
        if (!allowedTypes.includes(owner_type)) throw new Error("Invalid owner type");
        
        await service.addImagesService(owner_id, owner_type, req.files);

        return res.status(200).send({ message: "Images Added Successfully" });
    } catch (err) {
        return res.status(400).send({ err: err.message, });
    }
}
