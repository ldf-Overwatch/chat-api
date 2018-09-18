'use strict';


// les routes
let express = require('express');

module.exports = function(app) {

    let user = app.controllers.user;
    let message = app.controllers.message;

    app.post('/message', message.creation);
    app.get('/history', message.loadMessages);
    app.get('/messages/user/:user_id', message.find);
    app.post('/registration', user.registration);
    app.post('/login', user.login);
    app.get('/users', user.get);


};