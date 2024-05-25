const Log = require('../services/logs');

async function getAll(req, res, next) {
    try {
        const admin = req.decoded.admin;

        if (!admin) {
            throw new Error('No está autorizado');
        }

        const logs = await Log.getAll();

        res.status(200).json({logs});

    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAll,
}