const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET;
const generateToken = (user) => {
    return jwt.sign({ id: user.id, admin: user.admin }, SECRET_KEY, {
        expiresIn: '1h'
    });
};
const verifyToken = (req, res, next) => {
    const token = req.headers["access-token"];
    if (!token)
        res.status(401).json({error: "Token Invalido"});
    else {
        try{
            const decoded = jwt.verify(token, SECRET_KEY);
            req.decoded = decoded;
            next();    
        } catch (error) {
            if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError")
                res.status(401).json({error: "Token Invalido"});
            else {
                res.status(500).json({error: error.message});
            }
        }
    }
};
module.exports = { generateToken, verifyToken };