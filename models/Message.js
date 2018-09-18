let mongoose = require('mongoose');
let Schema = mongoose.Schema, ObjectID = Schema.ObjectId;

//MessageSchema

let MessageSchema = new Schema({

    author: {type: ObjectID, ref:'User', required: true, index: true},
    message: String,
    upload: String,
    created_at : {type: Date, default: Date.now}

});

let Message = mongoose.model('Message',MessageSchema);
module.exports =  function() {
    return Message;

};


