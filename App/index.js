// подключаем библиотеки
const express = require('express');
const cors = require('cors'); 
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
const config = require('./config/db');
const account = require('./routes/account');
const Post = require('./models/post');

// создание переменной для создания нашего приложения  
const app = express();

// создание порта
// хранит значение порта, по которому запускается наш локальный сервер
const port = 3000;

// инициализируем библиотеку паспорт и сессии
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

//взаимодействие других вебсайтов
app.use(cors());

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 1000000 }));

// подключение к базе данных
mongoose.connect(config.db, { useNewUrlParser: true, useUnifiedTopology: true });
// обработчик события, при успешном подключении 
mongoose.connection.on('connected', () => {
    console.log("Successful connection to the database")
});
// обработчик события, при не успешном подключении 
mongoose.connection.on('error', (err) => {
    console.log("Not successful connection to the database" + err)
});

// отслеживание порта 
app.listen(port, () => {
    console.log("The server was running on the port:" + port)
});
// отслеживаем страницу сайта
app.get('/', (req, res) => {
    Post.find().then( posts => res.json(posts))
});

app.get('/post/:id', (req, res) => {
    let url = req.url.split( '/' )
    id = url[2]
    Post.findById(id).then( post => res.json(post))
});

app.delete('/post/:id', (req, res) => {
    let url = req.url.split( '/' )
    id = url[2]
    Post.deleteOne({ _id: id}).then( () => res.json({ success: true }))
});

app.use('/account', account);