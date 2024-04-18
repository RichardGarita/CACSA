const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET;
const generateToken = (user) => {
    return jwt.sign({ id: user.id }, SECRET_KEY, {
        expiresIn: '1h'
    });
};
const verifyToken = (req, res, next) => {
    const token = req.headers["access-token"];
    if (!token)
        res.status(401).json({error: "Token Invalido"});
    else {
        if (jwt.verify(token, SECRET_KEY))
            next();
        else
        res.status(401).json({error: "Token Invalido"});
    }
};
module.exports = { generateToken, verifyToken };