const mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
    roomId: {
        type:String,
        required:true,
    },
    name: {
        type:String,
        required: true,
    },
    organization: {
        type:String,
        required:true,
    },
    img: {
        type:String,
        default:"/icon/default-room.png"
    },
    access:{
        type:Boolean,
        default:true
    },
    customFields: {
        type: [{ fieldName: String, fieldType: String }],
      },
      timeTable: {
        type:String,
        default: "/"
      }
},{timestamps:true});

const Room = mongoose.model("room",roomSchema);

module.exports = Room;