import * as validate from '../utils/validateData.js';
import * as cleanData from '../utils/cleanData.js';
import * as userService from '../services/userService.js';
import crypto from "crypto";
import redisClient from '../utils/redisClient.js'; 
import { sendEmail } from '../utils/emailService.js';
import { hashPassword } from '../utils/hash.js';


export const createUser = async (req, res) => {
    try {
        const { name, dob, gender, phone, email, password, image_url } = req.body;
        const userData = { name, dob, gender, phone, email, password, image_url };

        validate.validateUserData(userData);

        const { token, user } = await userService.createUserService(userData);

        return res.status(201).send({
            message: "User created successfully",
            token,
            user: cleanData.cleanUser(user),
        });
    } catch (err) {
        return res.status(400).send({ error: err.message });
    }
}


export const getMe = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).send({ error: "No user" });
        }

        return res.status(200).send(cleanData.cleanUser(req.user));
    } catch (err) {
        return res.status(400).send({ error: err.message });
    }
}


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        validate.validateEmail(email);
        validate.validatePassword(password);

        const { token, user } = await userService.loginService(email, password);

        return res.status(200).send({
            message: "login successfully",
            token,
            user: cleanData.cleanUser(user)
        });
    } catch (err) {
        return res.status(400).send({ error: err.message });
    }
}


export const update = async (req, res) => {
    try {
        const user = req.user;
        const { name, phone, dob, image_url } = req.body;

        if (name) validate.validateName(name);
        if (phone) validate.validatePhone(phone);
        if (dob) validate.validateDob(dob);
        if (image_url) validate.validateImageUrl(image_url);

        const updatedUser = await userService.updateUserService(user, { name, phone, dob, image_url });

        return res.status(200).send({
            message: "User updated successfully",
            user: cleanData.cleanUser(updatedUser),
        });
    } catch (err) {
        return res.status(400).send({ error: err.message });
    }
}


export const deleteUser = async (req, res) => {
    try {
        const user = req.user;
        const auth = req.get('Authorization');

        await userService.deleteUserService(user, auth);

        return res.status(200).send({
            message: 'User deleted successfully',
        });
    } catch (err) {
        return res.status(400).send({ error: err.message });
    }
}


export const undoDelete = async (req, res) => {
    try {
        const { email, password } = req.body
        validate.validateEmail(email);
        validate.validatePassword(password);

        const { user, token } = await userService.undoDeleteService(email, password);

        return res.status(200).send({
            message: "User undone successfully",
            user: cleanData.cleanUser(user),
            token,
        });
    } catch (err) {
        return res.status(400).send({ error: err.message });
    }

}


export const logOut = async (req, res) => {
    try {
        const auth = req.get('Authorization');

        await userService.logOutService(auth);

        return res.status(200).send({
            message: 'Logged out successfully',
        });
    } catch (err) {
        return res.status(400).send({ error: err.message });
    }
}


export const chagePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body
        const user = req.user;

        if (!oldPassword || !newPassword || !user) {
            return res.status(400).send({message: 'Missing data'});
        }

        validate.validatePassword(newPassword);

        await userService.changePasswordUserService(user, oldPassword, newPassword);

        return res.status(200).send({
            message: 'User password changed successfully',
        });
    } catch (err) {
        return res.status(400).send({ error: err.message });
    }
}


export const getAnotherUser = async (req, res) => {
    try {
        const { id, email } = req.query;
        
        if (!email && !id) return res.status(400).send({message: 'Missing email and id'});

        const user = await userService.getAnotherUserService(email, id);

        if (!user) return res.status(400).send({message: "Can't get user"});

        return res.status(200).send({
            user: cleanData.cleanUser(user),
        });
    } catch (err) {
        return res.status(400).send({ error: err.message });
    }
}

export const searchUsers = async (req, res) => {
    try {
        const { q } = req.query;
        let users;
        if (!q) {
            users = await userService.getAllUsersService();
        } else {
            q = q.trim();
            if (!q) return res.status(400).send({ error: "q must have a value" });

            users = await userService.searchUsersService(q);
            if (!users) return res.status(400).send({ error: "No User found" });
        }

        return res.status(200).send({
            users,
        });
    } catch (err) {
        return res.status(400).send({ error: err.message });
    }
}


export const createAdmin = async (req, res) => {
    try {
        const { user_id } = req.body;
        if (!user_id) return res.status(400).send({ error: "Missing user id" });
        
        const user = await userService.getAnotherUserService('', user_id);

        if (!user) return res.status(400).send({ error: "Can't get user" });

        user.role = "admin";
        await user.save();

        return res.status(200).send({
            message: "User added as admin successfully",
            user,
        });
    } catch (err) {
        return res.status(400).send({ error: err.message });
    }
}


export const verifyUser = async (req, res) => {
    try {
        const token = req.query.token;
        if (!token) return res.status(400).send({ error: "Missing token" });

        await userService.verifyUserService(token);

        return res.redirect('http://localhost:5173/');
    } catch (err) {
        return res.status(400).send({ error: err.message });
    }
}


export const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).send({ err: "Missing email", });
        
        const user = await userService.getAnotherUserService(email, null);
        if (!user) return res.status(400).send({ err: "User not found", });

        const otp = crypto.randomInt(100000, 999999);
        await redisClient.set(`${email}`, otp, 60 * 60 * 10);

        await sendEmail(
            email,
            "Reset Your Password",
            `Your OTP code is: ${otp}. It will expire in 10 minutes.`
        );

        return res.status(200).send({ message: "OTP send to email", });
    } catch (err) {
        return res.status(400).send({ err: err.message, });
    }
}


export const resetPassword = async (req, res) => {
    try {
        const {email, otp, newPassword} = req.body;
        if (!email || !otp || !newPassword)  return res.status(400).send({ err: "Missing required fields" });

        const savedOtp = await redisClient.get(email);
        if (!savedOtp) return res.status(400).send({err: "OTP expired" });

        if (savedOtp !== otp) return res.status(400).send({ err: "Invalid OTP" });

        const user = await userService.getAnotherUserService(email, null);
        if (!user) return res.status(404).send({ err: "User not found" });

        const hashedPassword = await hashPassword(newPassword);
        await userService.updatePassword(user, hashedPassword);

        await redisClient.del(email);

        return res.status(200).send({ message: "Password reset successfully" });
    } catch (err) {
        return res.status(400).send({ err: err.message, });
    }
}
