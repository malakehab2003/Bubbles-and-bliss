import * as addressService from '../services/addressService.js';


export const createAddress = async(req, res) => {
    try {
        const user = req.user;
        const { name, address, government_id, city_id } = req.body;
    
        if (!name || !address || !city_id || !government_id || !user) return res.status(400).send({err: "Missing requried values"});

        const addressData = {
            user_id: user.id,
            name,
            address,
            government_id,
            user_id: user.id,
            city_id,
        };
        
        const newAddress = await addressService.createAddressService(addressData);

        return res.status(201).send({
            message: "Address added successfully",
            Address: newAddress,
        });
    } catch (err) {
        return res.status(400).send({ err: err.message });
    }
}


export const listAddresses = async (req, res) => {
    try {
        const user = req.user;
    
        if (!user) return res.status(400).send({err: "Missing user"});

        const Addresses = await addressService.listAddressService(user.id);

        return res.status(200).send ({
            addresses: cleanData.cleanAddresses(Addresses),
        });
    } catch (err) {
        return res.status(400).send({ err: err.message });
    }
}


export const updateAddress = async (req, res) => {
    try {
        const user = req.user;
        const { name, address, city_id, government_id } = req.body;
        const { id } = req.params;
        
        if (!user || !id) return res.status(400).send({err: "Missing data"});
        
        const addressData = {
            user_id: user.id,
            name,
            address,
            city_id,
            government_id,
            address_id: id,
        };
        
        const newAddress = await addressService.updateAddressService(addressData);
        
        return res.status(200).send ({
            message: "Address updated successfully",
            address: cleanData.cleanAddress(newAddress),
        });
    } catch (err) {
        return res.status(400).send({ err: err.message });
    }
}


export const deleteAddress = async (req, res) => {
    try {
        const user = req.user;
        const { id } = req.params;
        
        if (!user || !id) return res.status(400).send({err: "Missing data"});

        await addressService.deleteAddressService(user.id, id);

        return res.status(200).send({
            message: "Address deleted successfully",
        });
    } catch (err) {
        return res.status(400).send({ err: err.message });
    }
}