const mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
    roomId: {
        type:String,
        required:true,
    },
    username: {
        type:String
    },
    type:{
        type:String,
        default:"guest"
    },
    joinData:{
        type: [{ fieldName: String, fieldValue: String }],
        default: []
    },
    lastJoin: {
        type: Date,
        default: Date.now
    }
},{timestamps:true});

const roomUser = mongoose.model("roomUser",roomSchema);

module.exports = roomUser;