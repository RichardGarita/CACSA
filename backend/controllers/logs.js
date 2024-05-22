const Log = require('../services/logs');

async function getAll(req, res) {
    try {
        const admin = req.decoded.admin;

        if (!admin) {
            res.status(401).json({error: "No está autorizado"});
            return;
        }

        const logs = await Log.getAll();

        res.status(200).json({logs});

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getAll,
}