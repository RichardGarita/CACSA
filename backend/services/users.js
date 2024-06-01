var User = require('../models/users');
var Email = require('./email');
const jwt = require('../utils/jwtHelper');
const { v4: uuidv4 } = require('uuid');

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
        const {id, name, email} = data;
        await User.update({name, email}, {where: {id}});
        Email.sendEditNotification(email);
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

        const email = user.email;
        const name = user.name;
        await user.destroy();
        Email.sendDeleteNotification(email, name);
        return { message: 'Usuario eliminada correctamente' };
    } catch (error) {
        throw new Error(error.message);
    }
}

async function create (name, email) {
    try {
        const existed = await User.findOne({where: {email: email}});
        if (existed) {
            throw new Error ('Ya existe el recurso');
        }

        const tempPassword = uuidv4();

        const user = await User.create({name, email, password: tempPassword, admin: false, temp: true});
        if (!user){
            throw new Error ('Falló al crear el recurso');
        }

        Email.sendTemporaryPassword(email, tempPassword, name);

        return { message: 'Usuario agregado correctamente' };
    } catch (error) {
        throw new Error(error.message );
    }
}

async function getAll() {
    try {
        const usuarios = await User.findAll({attributes:['email', 'name', 'admin', 'id'], raw:true});
        return usuarios;
    } catch (error) {
        throw new Error(error.message);
    }
}

async function changeTempPassword(id, password){
    try {
        await User.update({password, temp: false}, {where: {id}});
        return { message: 'Imágenes subidas correctamente' };
    } catch (error) {
        throw new Error(error.message);
    }
}

async function recoverPassword(id){
    try {
        const user = await User.findByPk(id, {attributes: ['email', 'name']});
        if (!user)
            throw new Error('No se encontró el recurso');
        const password = uuidv4();
        await User.update({password, temp: true}, {where: {id}});
        Email.sendRecoveringPassword(user.email, user.name, password);
        return {message: 'Se reestableció la contraseña'};
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
    changeTempPassword,
    recoverPassword
}