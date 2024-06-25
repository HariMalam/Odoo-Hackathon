const RoomUser = require('../models/roomusers');
const User = require('../models/user');
const Room = require("../models/room");

const restrictToLoggedinUserOnly = async (req, res, next) => {
    const userUid = req.session.uid;

    if (!userUid) {
        return res.redirect("/auth/login");
    }

    const user = await User.findOne({_id:userUid});

    req.user = user;

    next();
};

const restrictToRoomUserOnly = async (req, res, next) => {
    const urlParts = req.url.split('/');
    const roomId = urlParts[2];
    const username = req.user.username;
    const roomUser = await RoomUser.findOne({roomId, username});
    
    if(!roomUser){
        return res.redirect(`/access/${roomId}`)
    }
    else if(roomUser.type === "guest"){
        return res.redirect(`/access/${roomId}`)
    }else{
        const room = await Room.findOne({roomId});
        req.room = room;
        req.roomUser = roomUser;
        next();
    }
}

module.exports = {restrictToLoggedinUserOnly, restrictToRoomUserOnly};
