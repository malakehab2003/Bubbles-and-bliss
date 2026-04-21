import { Government } from "../models/db.js";


export const getGovernment = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) return res.status(400).send({ err: "Missing id", });

        const government = await Government.findByPk(id);

        if (!government) return res.status(400).send({ err: "Didn't find the government", });

        return res.status(200).send({ government, })
    } catch (err) {
        return res.status(400).send({ err: err.message, });
    }
}


export const listGovernment = async (req, res) => {
    try {
        const governments = await Government.findAll();

        if (!governments) return res.status(400).send({ err: "Can't get governments", });

        return res.status(200).send({ governments, })
    } catch (err) {
        return res.status(400).send({ err: err.message, });
    }
}
