import { User } from '../models/db.js';
import * as jwt from '../utils/jwt.js';
import * as hash from '../utils/hash.js';
import * as auth from '../utils/auth.js';
import redisClient from '../utils/redisClient.js';
import { Op } from 'sequelize';


export const createUserService  = async (userData) => {
    try {
        const existUser = await auth.getUserByEmail(userData.email);
    
        if (existUser) {
            throw new Error('Email already exists');
        }

        const hashedPassword = await hash.hashPassword(userData.password);

        userData.password = hashedPassword;
        
        const user = await User.create({
            ...userData,
            last_login: new Date(),
            role: 'user',
        });

        const token = jwt.createToken(userData.email);
        await auth.generateTokenForVerification(userData.email);

        return {
            token,
            user
        };
    } catch (err) {
        throw new Error (err)
    }
}


export const loginService = async (email, password) => {
    const user = await auth.getUserByEmail(email);

    if (!user || user.is_deleted) {
        throw new Error ("User not found" );
    }

    const isMatch = await hash.checkPassword(password, user.password);

    if (!isMatch) {
        throw new Error ('Incorrect password');
    }

    user.last_login = new Date();
    await user.save()
    
    const token = jwt.createToken(email);

    return {
        token,
        user,
    };
}


export const updateUserService = async (user, data) => {
    if (!user) {
        throw new Error ("No user");
    }

    const fieldToUpdate = ['name', 'phone', 'image_url', 'dob'];

    fieldToUpdate.forEach((field) => {
        if(data[field]) {
            user[field] = data[field];
        }
    });

    await user.save();

    return user;
}


export const deleteUserService = async (user, authorization) => {
    if (!user || !auth) throw new Error ("No user or auth");

    const token = auth.getTokenFromAuth(authorization);
    const duration = 7 * 24 * 60 * 60;
    redisClient.set(`blacklist_${token}`, 'true', duration);

    user.is_deleted = true;
    await user.save();
}


export const undoDeleteService = async (email, password) => {
    const user = await auth.getUserByEmail(email);
    
    if (!user) throw new Error ('no User');

    const isMatch = await hash.checkPassword(password, user.password);
    if (!isMatch) throw new Error ('Wrong password');


    user.is_deleted = false;
    await user.save()
    const token = jwt.createToken(email);

    return {
        token,
        user,
    }
}


export const logOutService = async (authorization) => {

    const token = auth.getTokenFromAuth(authorization);
    const duration = 7 * 24 * 60 * 60;
    redisClient.set(`blacklist_${token}`, 'true', duration);
}


export const changePasswordUserService = async (user, oldPassword, newPassword) => {
    const isMatch = await hash.checkPassword(oldPassword, user.password);
    if (!isMatch) throw new Error ('Password not match');

    const hashedPassword = await hash.hashPassword(newPassword);

    user.password = hashedPassword
    await user.save();
}


export const getAnotherUserService = async (email, id) => {
    if (!email && !id) throw new Error ('No email and id');

    const where = {};
    if (id) where.id = id;
    if (email) where.email = email;

    const user = await User.findOne({ where });

    if (!user) throw new Error ('No user Found');

    return user;
}


export const searchUsersService = async (q) => {
    const users = await User.findAll({
        where: {
            [Op.or]: [
                {name: { [Op.like]: `%${q}%` }},
                {email: { [Op.like]: `%${q}%` }},
            ]
        },
        attributes: ['id', 'name', 'email', 'role']
    });

    return users;
}


export const getAllUsersService = async () => {
    const users = await User.findAll();
    return users;
}


export const verifyUserService = async (token) => {
    const email = jwt.verifyTokenAndReturnEmail(token);
    if (!email) throw new Error ("Invalid token");

    const user = await auth.getUserByEmail(email);
    if (!user) throw new Error ("No user found");

    user.is_verified = true;
    await user.save()
}


export const updatePassword = async (user, password) => {
    user.password = password;
    await user.save();
}
