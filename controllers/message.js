let mongoose = require('mongoose');
let multiparty = require('multiparty');
let path = require('path');
let fs = require('fs');

/**
 Enregister les message du chat  dans la base  de bonnée
 */


//enregister dans db
exports.creation = function(req, res ) {

    let form = new multiparty.Form({maxFilesSize: 1024 * 1024 * 2});

    form.parse(req, function (err, fields, files) {


        if (err) console.log(err);


        let message = fields.message[0] || '';

        if (message !== undefined && message.length > 0) {


            if (files.file) {

                console.log(JSON.stringify(files.file));

                var old_path = files.file[0].path,
                    file_size = files.file[0].size,
                    index = old_path.lastIndexOf('/') + 1,
                    file_name = old_path.substr(index),
                    new_path = path.join(process.env.PWD, '/public/', file_name),
                    bdd_path = 'images/' + file_name;

                console.log(bdd_path);

                // changer
                let new_message = {
                    author: fields.author[0] || '', // id utilisateur
                    message: message,
                    upload: bdd_path
                };

                console.log(new_message);


                //db connection a la base de donnée

                _db.User.findOne({_id: new_message.author}).exec().then(function (user) {

                    if (user) {

                        user.connected = Date.now;

                        user.save(function (err) {

                            if (err) console.log(err);

                            fs.readFile(old_path, function (err, data) {
                                if(err) console.log(err);
                                fs.writeFile(new_path, data, function (err) {
                                    if (err) console.log(err);
                                    fs.unlink(old_path, function (err) {

                                        console.log(new_message);
                                        let messageObject = _db.Message(new_message);

                                        messageObject.save(function (err, result) { // erreu
                                            if (err) {
                                                console.log(err);
                                                return res.status(500).send(err);
                                            }
                                            else {
                                                console.log(result);
                                                return res.send(result);
                                            }
                                        });
                                    });
                                });
                            });
                        });
                    }
                }).catch(console.warn);
            }
            else {
                let new_message = {
                    author: fields.author[0] || '', // id utilisateur
                    message: message
                };

                console.log(new_message);

                //db connection a la base de donnée

                _db.User.findOne({_id: new_message.author}).exec().then(function (user) {

                    if (user) {

                        user.connected = Date.now;

                        user.save(function (err) {

                            if (err) console.log(err);


                                console.log(new_message);
                                let messageObject = _db.Message(new_message);

                                messageObject.save(function (err, result) { // erreu
                                            if (err) {
                                                console.log(err);
                                                return res.status(500).send(err);
                                            }
                                            else {
                                                console.log(result);
                                                return res.send(result);
                                            }
                                        });
                        });

                    }
                }).catch(console.warn);
            }
        }
    });
};




// afficher les 30 derniére message de tous le monde

exports.loadMessages = function(req, res) {
    _db.Message.find().sort({created_at: -1}).limit(30).exec().then(function(results){
        return res.send(results.reverse());
    }).catch(console.warn);
};



// supprimier

exports.delete = function(req, res)  {

    _db.Message.findByIdAndRemove(req.params.messageId, function(err,message) {

        return res.send(response = {
            message: "supprimé avec succès",
            id: message._id
        });
    });
};


//afficher les message  de  user
exports.find=function (req, res) {

    _db.Message.find({author: req.params['user_id']}).exec(function (err, result) {

        if (err) console.log(err);

        return res.send(result );

    });
};





