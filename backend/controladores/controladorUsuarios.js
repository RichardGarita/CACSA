var User = require('../modelos/users');
const jwt = require('../utils/jwtHelper');

async function loginUsuario(req, res) {
    const {userName, password} = req.body;
    if (!userName || !password) {
        res.status(400).json({ error: 'Debes llenar todos los campos' });
        return;
    }
    try {
        const user = await User.findOne({
            where: {
              userName: userName,
              password: password
            }
          });
        if (user){
            const token = jwt.generateToken(user);
            res.status(200).json({token: token, userId: user.id});
        }
        else
            res.status(402).json({error: 'Usuario no encontrado'});
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