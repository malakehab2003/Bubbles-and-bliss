import { Address } from '../models/db.js';


export const getAddress = async (address_id) => {
    if (!address_id) throw ("Missing address id");

    const address = await Address.findOne({
        where: {id: address_id},
    });

    if (!address) throw ("No address found");

    return address;
}


export const checkAddressForUser = (address, user_id) => {
    if (!address || !user_id) throw ("Can't check address");

    return address.user_id === user_id;
}
