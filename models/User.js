let mongoose = require('mongoose');
let Schema = mongoose.Schema;


/**
 * le schema user
  */

    let UserSchema = new Schema( {
        username:  {type: String, required: true, index: { unique: true, dropDups: true } },
        image: String,
        password: {type: String, required: true},
        email: {type: String, required: true, index: { unique: true, dropDups: true } },
        name : {type: String, required: true},
        connected: {type: Date, default: Date.now}
    });

let User = mongoose.model('User',UserSchema);
module.exports =  function() {
    return User;

};

