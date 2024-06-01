var User = require('../services/users');

async function loginUser(req, res, next) {
    const {email, password} = req.body;
    if (!email || !password) {
        throw new Error('No se encontraron los campos obligatorios');
    }
    try {
        const token = await User.loginUser(email, password);
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
        const user = await User.getProfile(id);
        res.status(200).json({user});
    } catch (error) {
        next(error);
    }
}

async function editUser(req, res, next){
    try {
        const {id, name, email, password} = req.body;
        if(!id || !name || !email || !password) {
            throw new Error('No se encontraron los campos obligatorios');
        }
        const data = {id, name, email, password};
        const response = await User.editOne(data);
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

        const response = await User.deleteOne(id);
        res.status(200).json(response);

    } catch (error) {
        next(error);
    }
}

async function addUser (req, res, next) {
    try {
        const {name, email} = req.body;
        const admin = req.decoded.admin;

        if (!admin) {
            throw new Error('No está autorizado');
        }

        if(!name || !email) {
            throw new Error('No se encontraron los campos obligatorios');
        }

        const response = await User.create(name, email);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}

async function getAllUsers(req, res, next) {
    try {
        const usuarios = await User.getAll();
        res.status(200).json(usuarios);
    } catch (error) {
        next(error);
    }
}

async function changeTempPassword(req, res, next) {
    try {
        console.log(req.body);
        const {password} = req.body;
        const id = req.decoded.id;

        if (!password || !id )
            throw new Error('No se encontraron los campos obligatorios');

        const response = await User.changeTempPassword(id, password);
        res.status(200).json(response);
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
    changeTempPassword
};