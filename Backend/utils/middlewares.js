import * as userAuth from './auth.js';
import redis from './redisClient.js';

export const AuthRequest = async (req, res, next) => {
    try {
        const auth = req.get('Authorization');

        if (!auth) return res.status(401).send({error: "Unauthorized"});


        const token = userAuth.getTokenFromAuth(auth);
        if (!token || await redis.get(`blacklist_${token}`)) {
            return res.status(401).send({error: "Token blacklisted"});
        }

        const user = await userAuth.getUserFromToken(token);
        
        if (user.is_deleted) {
            return res.status(401).send({error: "User deleted"});
        }

        if (!user.is_verified) return res.status(401).send({error: "User not verified"});

        req.user = user;
        next()
    } catch (err) {
        return res.status(401).send({error: "Unauthorized"});
    }
}


export const roleAuth = (allowedRoles) => {
    return (req, res, next) => {
        const user = req.user;

        if (!user) {
            return res.status(401).send({ error: "Unauthorized" });
        }

        if (!allowedRoles.includes(user.role)) {
            return res.status(403).send({ error: "Forbidden" });
        }

        next();
    };
};
