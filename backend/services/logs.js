var Log = require('../models/logs');
var User = require('../models/users');
var Producer = require('../models/producers');

async function createLog(userId, producerId, process) {
    try {
        if (!userId || !producerId)
            return false;

        const user = await User.findByPk(userId);
        const producer = await Producer.findByPk(producerId);

        if (!user || !producer)
            return false;

        await Log.create({
            editorName: user.userName, 
            producerIdentification: producer.identification,
            producerName: producer.name,
            process: process
        })

        return true;
    } catch (error) {
        throw error;
    }
}

async function getAll () {
    try {
        const logs = await Log.findAll();
        return logs;
    } catch (error) {
        throw error;
    }
}

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
    createLog,
    getAll,
    getLastLog
}