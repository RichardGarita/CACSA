var Log = require('../models/logs');
var User = require('../models/users');
var Producer = require('../models/producers');

async function createLog(userId, producerId, process) {
    try {
        const user = await User.findByPk(userId);
        const producer = await Producer.findByPk(producerId);

        if (!user || !producer)
            throw new Error('No se encontró el recurso');

        await Log.create({
            editorName: user.email, 
            producerIdentification: producer.identification,
            producerName: producer.name,
            process: process
        })

        return {message: 'Bitácora agregada exitosamente'};
    } catch (error) {
        throw new Error(error.message);
    }
}

async function getAll () {
    try {
        const logs = await Log.findAll({
            order: [['updatedAt', 'DESC']]
        });
        return logs;
    } catch (error) {
        throw new Error(error.message);
    }
}

async function getLastLog(id){
    try {
        const log = await Log.findOne({
            where: { producerIdentification: id },
            order: [['updatedAt', 'DESC']],
            limit: 1
        });
        return log;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = {
    createLog,
    getAll,
    getLastLog
}