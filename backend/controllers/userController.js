const { add } = require('@tensorflow/tfjs');
var User = require('../models/users');
const jwt = require('../utils/jwtHelper');

async function loginUser(req, res) {
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

async function getProfile(req, res) {
    try {
        const id = req.params.id;
        if (!id) {
            res.status(400).json({message: 'Todos los campos son necesarios'});
            return;
        }
        const usuario = await User.findByPk(id, {attributes: ['name', 'userName', 'admin']});
        if (usuario) {
            res.status(200).json(usuario);
        }
        else 
            res.status(402).json({message: 'No se encontró el recurso'});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function editUser(req, res){
    try {
        const {id, name, userName, password} = req.body;
        if(!id || !name || !userName || !password) {
            res.status(400).json({message: 'Todos los campos son necesarios'});
            return;
        }

        await User.update({name, userName, password}, {where: {id}});
        res.status(200).json({message: 'Usuario actualizado'});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function deleteUser (req, res) {
    try {
        const id = req.params.id;

        const user = await User.findByPk(id);
        if (!user) {
            res.status(402).json({error: 'No se encontró el recurso'});
            return;
        }

        await user.destroy();
        res.status(200).json({ message: 'Usuario eliminada correctamente' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function addUser (req, res) {
    try {
        const {name, userName, password} = req.body;
        if(!name || !userName || !password) {
            res.status(400).json({message: 'Todos los campos son necesarios'});
            return;
        }

        const existed = await User.findOne({where: {userName: userName}});
        if (existed) {
            res.status(402).json({ error: 'Ya existe el usuario' });
            return;
        }

        const user = await User.create({name, userName, password, admin: false});
        if (!user){
            res.status(501).json({ error: 'Falló al crear el usuario' });
            return;
        }

        res.status(200).json({ message: 'Usuario agregado correctamente' });
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
    loginUser,
    getAllUsers,
    getProfile,
    editUser,
    deleteUser,
    addUser,
};