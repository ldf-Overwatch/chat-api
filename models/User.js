let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// le schema user
    let UserSchema = new Schema({
        username:  String,
        image: String,
        password: String,
        email:String,
        name : String,
        connected: {type: Date, default: Date.now}
    });

let User = mongoose.model('User',UserSchema);
module.exports =  function() {
    return User;

};

