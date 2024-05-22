var Log = require('../models/logs');

async function getLastLog(id){
    try {
        if (!id)
            return false;

        const log = await Log.findOne({
            where: { producerIdentification: id },
            order: [['updatedAt', 'DESC']],
            limit: 1
        });
        return log;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getLastLog,
}