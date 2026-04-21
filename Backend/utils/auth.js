import { User } from '../models/db.js';
import * as jwt from './jwt.js';
import * as redis from './redisClient.js';
import { sendEmail } from './emailService.js';

export const getUserByEmail = async(email) =>{
    if (!email) {
        throw new Error('No email');
    }

    try {
        const user = await User.findOne({
            where: {
                email,
            },
        });

        return user;
    } catch (err) {
        throw new Error(err)
    }
}


export const getTokenFromAuth = (auth) => {
    if (!auth) {
        throw new Error("Unauthorized");
    }

    if (auth.slice(0, 7) !== "Bearer ") {
        throw new Error("Unauthorized");
    }

    return auth.replace('Bearer ', '');
}


export const getUserFromToken = async(token) => {
    if (!token) {
        throw new Error("Unauthorized");
    }

    try {
        const email = jwt.verifyTokenAndReturnEmail(token);

        const user = await getUserByEmail(email);

        if (!user) {
            throw new Error("User not found");
        }

        return user;
    } catch (err) {
        throw new Error (err)
    }
}


export const generateTokenForVerification = async (email) => {
    const token = jwt.createToken(email);
    const url = `http://localhost:5000/api/user/verify-email?token=${token}`;

    const message = `Please verify your email by clicking the link: ${url}\n\nThis link expires in 1 hour.`;

    await sendEmail(email, "verify your email", message);
}
