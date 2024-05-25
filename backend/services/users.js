var User = require('../models/users');
const jwt = require('../utils/jwtHelper');

async function loginUser(email, password) {
    try {
        const user = await User.findOne({
            where: {
              email: email
            }
          });

        if (!user)
            throw new Error('No se encontró el recurso');
        
        if (user && await user.validatePassword(password)){
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
        const user = await User.findByPk(id, {attributes: ['name', 'email', 'admin']});
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
        const {id, name, email, password} = data;
        await User.update({name, email, password}, {where: {id}});
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

async function create (name, email, password) {
    try {
        const existed = await User.findOne({where: {email: email}});
        if (existed) {
            throw new Error ('Ya existe el recurso');
        }

        const user = await User.create({name, email, password, admin: false});
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