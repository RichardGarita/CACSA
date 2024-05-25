var UserService = require('../services/users');
const jwt = require('../utils/jwtHelper');

async function loginUser(req, res, next) {
    const {userName, password} = req.body;
    if (!userName || !password) {
        throw new Error('No se encontraron los campos obligatorios');
    }
    try {
        const token = await UserService.loginUser(userName, password);
        res.status(200).json({token});
    } catch (error) {
        next(error);
    }
}

async function getProfile(req, res, next) {
    try {
        const id = req.params.id;
        if (!id) {
            throw new Error('No se encontraron los campos obligatorios');
        }
        const user = await UserService.getProfile(id);
        res.status(200).json({user});
    } catch (error) {
        next(error);
    }
}

async function editUser(req, res, next){
    try {
        const {id, name, userName, password} = req.body;
        if(!id || !name || !userName || !password) {
            throw new Error('No se encontraron los campos obligatorios');
        }
        const data = {id, name, userName, password};
        const response = await UserService.editOne(data);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}

async function deleteUser (req, res, next) {
    try {
        const id = req.params.id;
        const admin = req.decoded.admin;

        if(!id) {
            throw new Error('No se encontraron los campos obligatorios');
        }

        if (!admin) {
            throw new Error('No está autorizado');
        }

        const response = await UserService.deleteOne(id);
        res.status(200).json(response);

    } catch (error) {
        next(error);
    }
}

async function addUser (req, res, next) {
    try {
        const {name, userName, password} = req.body;
        if(!name || !userName || !password) {
            throw new Error('No se encontraron los campos obligatorios');
        }

        const response = await UserService.create(name, userName, password);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}

async function getAllUsers(req, res, next) {
    try {
        const usuarios = await UserService.getAll();
        res.status(200).json(usuarios);
    } catch (error) {
        next(error);
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