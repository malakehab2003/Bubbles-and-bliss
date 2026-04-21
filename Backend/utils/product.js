import { Op, fn, col } from 'sequelize';
import { Product, ProductCategory, ProductImage, Brand, Review, User } from '../models/db.js';

export const buildWhereFilters = (filters) => {
    const where = {};
    where[Op.and] = [];

    if (filters.status) where.status = filters.status;

    if (filters.category_id) {
        where.product_category_id = {
            [Op.in]: filters.category_id.split(',').map(Number)
        };
    }

    if (filters.brand_id) {
        where.brand_id = {
            [Op.in]: filters.brand_id.split(',').map(Number)
        };
    }

    if (filters.min_price || filters.max_price) {
        where.price = {};
        if (filters.min_price) where.price[Op.gte] = Number(filters.min_price);
        if (filters.max_price) where.price[Op.lte] = Number(filters.max_price);
    }

    if (filters.is_sale === 'true') where.sale = { [Op.gt]: 0 };

    if (filters.rate) where.rate = { [Op.gte]: Number(filters.rate) };

    if (filters.name) {
        where[Op.and].push({
            [Op.or]: [
                { name: { [Op.like]: `%${filters.name}%` } },
                { description: { [Op.like]: `%${filters.name}%` } }
            ]
        });
    }

    if (filters.colors) {
        where[Op.and].push({
            [Op.or]: filters.colors.split(',').map(c =>
                fn('JSON_CONTAINS', col('colors'), JSON.stringify(c))
            )
        });
    }

    if (filters.sizes) {
        where[Op.and].push({
            [Op.or]: filters.sizes.split(',').map(s =>
                fn('JSON_CONTAINS', col('sizes'), JSON.stringify(s))
            )
        });
    }

    return where;
};


export const getProducts = async (where, limit, offset) => {
    const products = await Product.findAndCountAll({
        where,
        limit: Number(limit),
        offset: Number(offset),
        include: [
            {
                model: ProductCategory,
                as: 'category',
                attributes: ['id', 'name'],
            },
            {
                model: ProductImage,
                as: 'image',
                attributes: ['id', 'image_url'],
            },
            {
                model: Brand,
                as: 'brand',
                attributes: ['id', 'name'],
            },
            {
                model: Review,
                as: 'review',
                attributes: ['rate', 'message', 'image_url'],
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ["id", 'name'],
                    }
                ]
            },
        ]
    });

    return products.rows;
}
