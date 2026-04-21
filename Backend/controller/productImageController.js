import * as service from '../services/productImageService.js';


export const deleteImage = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) return res.status(400).send({ err: "Missing id", });
        
        const image = await service.returnImageService(id);
        
        if (!image) return res.status(400).send({ err: "Can't get image", });
        
        await image.destroy();
        
        return res.status(200).send({ message: "Image Deleted Successfully" });
    } catch (err) {
        return res.status(400).send({ err: err.message, });
    }
}


export const addImages = async (req, res) => {
    try {
        const { product_id, images_url } = req.body;
        console.log(product_id, images_url);
        
        if (!product_id || !images_url) return res.status(400).send({ err: "Missing data", });
        
        await service.addProductImageService(product_id, images_url);
        
        return res.status(200).send({ message: "Images Added Successfully" });
    } catch (err) {
        return res.status(400).send({ err: err.message, });
    }
}
