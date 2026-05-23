import { Order, OrderItem, Product, User, PromoCode, Government, City } from "../models/db.js";
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


// endpoint عام بدون auth — للـ homepage
export const getFeaturedProducts = async (req, res) => {
    try {
        // جيب أكتر 3 منتجات مبيعاً من الـ order items
        const topItems = await OrderItem.findAll({
            attributes: [
                "product_id",
                [Sequelize.fn("SUM", Sequelize.col("OrderItem.quantity")), "salesCount"]
            ],
            include: [
                {
                    model: Product,
                    as: "product",
                    attributes: ["id", "name", "price", "sale", "stock"],
                    include: [{ model: Image, as: "image", attributes: ["url"] }]
                }
            ],
            group: ["product_id", "product.id", "product->image.id"],
            order: [[Sequelize.literal("salesCount"), "DESC"]],
            limit: 3
        });

        // لو فيه 3 منتجات مبيعة ارجعهم
        if (topItems.length === 3) {
            const products = topItems.map(item => item.product);
            return res.status(200).send({ products });
        }

        // لو مفيش orders كافية — جيب أي 3 منتجات
        const fallbackProducts = await Product.findAll({
            limit: 3,
            include: [{ model: Image, as: "image", attributes: ["url"] }]
        });

        return res.status(200).send({ products: fallbackProducts });
    } catch (err) {
        return res.status(400).send({ err: err.message });
    }
}


export const getMonthOrders = async (req, res) => {
    try {
        const { month, year } = req.query;
        if (!month || !year) return res.status(400).send({ err: "Month and year are required" });

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        const orders = await Order.findAll({
            where: { created_at: { [Op.between]: [startDate, endDate] } },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email', 'phone']
                },
                {
                    model: PromoCode,
                    as: 'promocode',
                },
                {
                    model: Government,
                    as: 'government',
                    attributes: ['id', 'name']
                },
                {
                    model: City,
                    as: 'city',
                    attributes: ['id', 'name']
                },
            ]
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