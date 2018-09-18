let mongoose = require('mongoose');

//la connection a base de donnée

module.exports = function() {
    mongoose.connect('mongodb://localhost:27017/chat');

    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Erreur lors de la connexion'));
    db.once('open', function (){
        console.log("Connexion à la base OK");
    });

    mongoose.set('debug', true);

    return db;
};
