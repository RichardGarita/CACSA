var User = require('../models/users');
const jwt = require('../utils/jwtHelper');

async function loginUser(userName, password) {
    try {
        const user = await User.findOne({
            where: {
              userName: userName,
              password: password
            }
          });
        
        if (user){
            const token = jwt.generateToken(user);
            return token;
        }
        else
            throw new Error('No se encontró el recurso');
    } catch (error) {
        throw new Error (error.message);
    }
}

async function getProfile(id) {
    try {
        const user = await User.findByPk(id, {attributes: ['name', 'userName', 'admin']});
        if (user)
            return user;
        else 
            throw new Error('No se encontró el recurso');
    } catch (error) {
        throw new Error (error.message);
    }
}

async function editOne(data){
    try {
        const {id, name, userName, password} = data;
        await User.update({name, userName, password}, {where: {id}});
        return {message: 'Usuario actualizado'};
    } catch (error) {
        throw new Error (error.message);
    }
}

async function deleteOne (id) {
    try {

        const user = await User.findByPk(id);
        if (!user) {
            throw new Error('No se encontró el recurso');
        }

        await user.destroy();
        return { message: 'Usuario eliminada correctamente' };
    } catch (error) {
        throw new Error(error.message);
    }
}

async function create (name, userName, password) {
    try {
        const existed = await User.findOne({where: {userName: userName}});
        if (existed) {
            throw new Error ('Ya existe el recurso');
        }

        const user = await User.create({name, userName, password, admin: false});
        if (!user){
            throw new Error ('Falló al crear el recurso');
        }

        return { message: 'Usuario agregado correctamente' };
    } catch (error) {
        throw new Error(error.message );
    }
}

async function getAll() {
    try {
        const usuarios = await User.findAll({raw:true});
        return usuarios;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = {
    loginUser,
    getProfile,
    editOne,
    deleteOne,
    create,
    getAll,
}