import { Order, OrderItem, Product } from "../models/db.js";
import { Sequelize } from "sequelize";
import { Op } from "sequelize";


export const getDashboard = async (req, res) => {
    try {
    // Total Revenue
    const totalRevenue = await Order.sum("total_price") || 0;

    // Total Orders
    const totalOrders = await Order.count();

    // Top Selling Products
    const topSellingProducts = await OrderItem.findAll({
      attributes: [
        "product_id",
        [Sequelize.fn("SUM", Sequelize.col("quantity")), "salesCount"]
      ],
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["name"]
        }
      ],
      group: ["product_id", "Product.id"],
      order: [[Sequelize.literal("salesCount"), "DESC"]],
      limit: 3
    });

    // Least Selling Products
    const leastSellingProducts = await OrderItem.findAll({
      attributes: [
        "product_id",
        [Sequelize.fn("SUM", Sequelize.col("quantity")), "salesCount"]
      ],
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["name"]
        }
      ],
      group: ["product_id", "Product.id"],
      order: [[Sequelize.literal("salesCount"), "ASC"]],
      limit: 5
    });

    return res.status(200).send({
      totalRevenue,
      totalOrders,
      topSellingProducts,
      leastSellingProducts,
    });
    } catch (err) {
        return res.status(400).send({ err: err.message, });
    }
}


export const getMonthOrders = async (req, res) => {
    try {
        const { month, year } = req.query;
        if (!month || !year) return res.status(400).send({ err: "Month and year are required" });

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        const orders = await Order.findAll({
            where: { created_at: { [Op.between]: [startDate, endDate] } }
        });

        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_price), 0);
        const formattedRevenue = Number(totalRevenue.toFixed(2));

        return res.status(200).send({
            month,
            year,
            orders,
            totalOrders,
            totalRevenue: formattedRevenue,
        });
    } catch (err) {
        return res.status(400).send({ err: err.message, });
    }
}
