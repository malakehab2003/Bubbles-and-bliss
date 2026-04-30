import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const db = require('./index.cjs');

export const { 
    User,
    Cart,
    Address,
    Order,
    Product,
    ProductImage,
    PromoCode,
    OrderItem,
    Review,
    Wishlist,
    Government,
    City,
} = db;
export default db;