var User = require('../modelos/users');

async function loginUsuario(req, res) {
    const {userName, password} = req.body;
    if (!userName || !password) {
        res.status(401).json({ error: 'All fields must be fullfiled' });
        return;
    }
    try {
        const usuario = await User.findOne({
            where: {
              userName: userName,
              password: password
            }
          });
        if (usuario)
            res.status(200).json(usuario);
        else
            res.status(402).json({error: 'User not found'});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getAllUsers(req, res) {
    try {
        const usuarios = await User.findAll({raw:true});
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    loginUsuario,
    getAllUsers,
};