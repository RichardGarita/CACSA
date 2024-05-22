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

module.exports = {
    createLog,
}