let mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
let multiparty = require('multiparty');
let path = require('path');
let fs = require('fs');

function minMinutes(date, minutes) {
    return new Date(date.getTime() - minutes*60000);
}

passport.use(new LocalStrategy(
    function(username, password, done) {
        _db.User.findOne({
            username: username,

        }, function(err, user) {
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false);
            }

            if (user.password !== password) {
                return done(null, false);
            }
            return done(null, user);
        });
    }
));

//authentifier erreur
exports.authenticate = passport.authenticate('local', { failureRedirect: '/error' });

/**
 * {post} /user
 *
 * @param req
 * @param res
 * @returns {*}
 */

//inscription
exports.registration = function(req, res ) {

    let form = new multiparty.Form({maxFilesSize: 1024 * 1024 * 2});

    form.parse(req, function (err, fields, files) {

        let username = fields.username[0];
        let password = fields.password[0];
        let email = fields.email[0];
        let name= fields.name[0];


        if (username !== undefined  && username.length > 0 ) {

            {
                if(files.file) {

                    var old_path = files.file[0].path,
                        file_size = files.file[0].size,
                        index = old_path.lastIndexOf('/') + 1,
                        file_name = old_path.substr(index),
                        new_path = path.join(process.env.PWD, '/public/', file_name),
                        bdd_path = 'images/' + file_name;

                    // changer
                    let new_user = {
                        username: username,
                        image: bdd_path,
                        password: password,
                        email: email,
                        name: name
                    };

                    fs.readFile(old_path, function (err, data) {
                        fs.writeFile(new_path, data, function (err) {
                            if (err) console.log(err);
                            fs.unlink(old_path, function (err) {

                                if (err) console.log(err);
                                //db connection a la base de donnée
                                let userObject = _db.User(new_user);

                                userObject.save(function (err, result) { // erreu
                                    if (err) {

                                        res.status(500).send({err});
                                    }

                                    return res.send(result);

                                });
                            });
                        });
                    });
                }
                else {
                    return res.send('not image');
                }
            }


        }

        else {
            return res.send({err : "username is empty"});
        }
    });

};

//changer  user et password

exports.login = function(req, res ) {
    let form = new multiparty.Form({maxFilesSize: 1024 * 1024 * 2});

    form.parse(req, function (err, fields,) {

        let username = fields.username[0];
        let password = fields.password[0];

        if (username !== undefined && username.length > 0) {

            let user = {
                username: username,
                password: password
            };

            _db.User.findOne(user).exec().then(function(_user)
            {
                if(_user) {

                    _user.connected = new Date;
                    _user.save(function(err, __user){
                        return res.send(__user);
                    });
                }
                else {
                    return res.status(403).send({err: 'not found'});
                }
            }).catch(function(err){
                return res.status(403).send({err: err});
            });

        }

        else {
            return res.send({err: "username is empty"});
        }

    });
};

//recuperer dernière connecter

exports.get = function(req, res) {
    let date = minMinutes(new Date, 5);

    _db.User.find({connected: {$gt: date }}).exec().then(function(users){

        return res.send(users);

    }).catch(function(err){
        return res.status(403).send({err: err});
    });

};

//ça mettre date  du  derniére user connection

exports.connected = function(req, res) {

    _db.User.findOne({_id: req.params['user_id']}).exec().then(function(user){

        user.connected = new Date;
        user.save(function(_user){
            return res.send(_user);
        });

    }).catch(function(err){
        return res.status(403).send({err: err});
    });

};

