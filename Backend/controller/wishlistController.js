import { Product, Wishlist } from "../models/db.js";

export const listWishlist = async (req, res) => {
  try {
    const user = req.user;

    const wishlist = await Wishlist.findAll({
      where: { user_id: user.id },
      include: [
        {
          model: Product,
          as: "product",
        },
      ],
    });

    return res.status(200).send({ wishlist });
  } catch (err) {
    return res.status(400).send({ err: err.message });
  }
};

export const addProduct = async (req, res) => {
  try {
    const user = req.user;
    const { product_id } = req.body;

    if (!user || !product_id)
      return res.status(400).send({ err: "Missing requried fields" });

    const exists = await Wishlist.findOne({
      where: { product_id, user_id: user.id },
    });

    if (exists)
      return res
        .status(400)
        .send({ err: "Product already exists in your wishlist" });

    const product = await Product.findByPk(product_id);

    if (!product) return res.status(400).send({ err: "No product found" });

    const wishlist = await Wishlist.create({
      product_id,
      user_id: user.id,
    });

    if (!wishlist)
      return res.status(400).send({ err: "Can't add product to wishlist" });

    return res.status(201).send({
      message: "Product added to wishlist successfully",
      wishlist,
    });
  } catch (err) {
    return res.status(400).send({ err: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const user = req.user;
    const { product_id } = req.params;

    if (!user || !product_id)
      return res.status(400).send({ err: "Missing requried fields" });

    const wishlist = await Wishlist.findOne({
      where: { product_id, user_id: user.id },
    });

    if (!wishlist)
      return res.status(400).send({ err: "Can't find this item in wishlist" });

    await wishlist.destroy();

    return res
      .status(200)
      .send({ message: "product removed from wishlist successfully" });
  } catch (err) {
    return res.status(400).send({ err: err.message });
  }
};
