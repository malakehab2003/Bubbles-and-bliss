import { PromoCode } from "../models/db.js";


export const removePromocodeFromUser = async (id, user) => {
    if (!id || !user) throw new Error ("Missing id or user");
    
    const promocode = await PromoCode.findByPk(id);
    if (!promocode) throw new Error ("No promocode found");

    const has = await promocode.hasUser(user);
    if (!has) throw new Error ("User don't have this promocode");

    await promocode.removeUser(user);
}