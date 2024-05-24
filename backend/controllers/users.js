var User = require('../models/users');
var UserService = require('../services/users');
const jwt = require('../utils/jwtHelper');

async function loginUser(req, res) {
    const {userName, password} = req.body;
    if (!userName || !password) {
        res.status(400).json({ error: 'No se encontraron los campos obligatorios' });
        return;
    }
    try {
        const token = await UserService.loginUser(userName, password);
        res.status(200).json({token});
    } catch (error) {
        if (error.message === 'No se encontró el recurso')
            res.status(404).json({ error: error.message });
        else
            res.status(500).json({ error: error.message });
    }
}

async function getProfile(req, res) {
    try {
        const id = req.params.id;
        if (!id) {
            res.status(400).json({message: 'No se encontraron los campos obligatorios'});
            return;
        }
        const user = await UserService.getProfile(id);
        res.status(200).json({user});
    } catch (error) {
        if (error.message === 'No se encontró el recurso')
            res.status(404).json({error: error.message});
        else
            res.status(500).json({ error: error.message });
    }
}

async function editUser(req, res){
    try {
        const {id, name, userName, password} = req.body;
        if(!id || !name || !userName || !password) {
            res.status(400).json({message: 'No se encontraron los campos obligatorios'});
            return;
        }
        const data = {id, name, userName, password};
        const response = await UserService.editOne(data);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function deleteUser (req, res) {
    try {
        const id = req.params.id;
        const admin = req.decoded.admin;

        if(!id) {
            res.status(400).json({message: 'No se encontraron los campos obligatorios'});
            return;
        }

        if (!admin) {
            res.status(401).json({error: "No está autorizado"});
            return;
        }

        const response = await UserService.deleteOne(id);
        res.status(200).json(response);

    } catch (error) {
        if (error.message === 'No se encontró el recurso')
            res.status(404).json({ error: error.message });
        else
            res.status(500).json({ error: error.message });
    }
}

async function addUser (req, res) {
    try {
        const {name, userName, password} = req.body;
        if(!name || !userName || !password) {
            res.status(400).json({error: 'No se encontraron los campos obligatorios'});
            return;
        }

        const response = await UserService.create(name, userName, password);
        res.status(200).json(response);
    } catch (error) {
        switch (error.message){
            default:
                res.status(500).json({ error: error.message });
                break;
            case 'Ya existe el recurso':
                res.status(402).json({ error: error.message });
                break;
            case 'Falló al crear el recurso':
                res.status(501).json({ error: error.message });
                break;
        }
    }
}

async function getAllUsers(req, res) {
    try {
        const usuarios = await UserService.getAll();
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