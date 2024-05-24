const errHandler = require('../middlewares/errorHandler');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET;
const generateToken = (user) => {
    return jwt.sign({ id: user.id, admin: user.admin }, SECRET_KEY, {
        expiresIn: '10s'
    });
};
const verifyToken = (req, res, next) => {
    const token = req.headers["access-token"];
    if (!token)
        return errHandler(new Error('No está autorizado'), req, res, next);

    try{
        const decoded = jwt.verify(token, SECRET_KEY);
        req.decoded = decoded;
        next();    
    } catch (error) {
        if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError")
            return errHandler(new Error('No está autorizado'), req, res, next);
        else {
            return errHandler(error, req, res, next);
        }
    }
};
module.exports = { generateToken, verifyToken };