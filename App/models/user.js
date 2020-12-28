const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('../config/db');

// схема пользователя 
const UserSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    login: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
});

// экспортируем объект user
const User = module.exports = mongoose.model('User', UserSchema);

//поиск user по логинк
module.exports.getUserByLogin = function(login, callback) {
    const query = {login: login};
    User.findOne(query, callback);
};

// поиск user по id
module.exports.getUserById = function(id, callback) {
    User.findById(id, callback);
};
// добавляем пользователя в бд
module.exports.addUser = function(newUser, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            if (err) throw err;
            // хэширкем пароль пользователя
            newUser.password = hash;
            newUser.save(callback);
        });
    });
   
};

//функция для сравнения паролей
module.exports.comparePass = function(passFromUser, userDbPass, callback) {
    bcrypt.compare(passFromUser, userDbPass, (err, isMatch) => {
        if(err) throw err;
        callback(null, isMatch);
    });
};