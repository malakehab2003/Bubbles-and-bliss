import { City } from "../models/db.js";


export const getCity = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) return res.status(400).send({ err: "Missing id", });

        const city = await City.findByPk(id);

        if (!city) return res.status(400).send({ err: "Didn't find the city", });

        return res.status(200).send({ city, })
    } catch (err) {
        return res.status(400).send({ err: err.message, });
    }
}


export const listCity = async (req, res) => {
    try {
        const citys = await City.findAll();

        if (!citys) return res.status(400).send({ err: "Can't get citys", });

        return res.status(200).send({ citys, })
    } catch (err) {
        return res.status(400).send({ err: err.message, });
    }
}
