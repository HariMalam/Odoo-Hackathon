const multer = require("multer");
const fs = require("fs");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const User = require("../models/user");
const Room = require("../models/room");
const RoomUsers = require("../models/roomusers");
const roomUser = require("../models/roomusers");

const handleGetHome = async (req, res) => {
  const user = req.user;
  res.render("home/index", { user });
};

const handleGetAvailableRooms = async (req,res) => {
  const username = req.user.username;
  try {
    const rooms = await RoomUsers.aggregate([
      {
        $match: {
          username: username,
        },
      },
      {
        $lookup: {
          from: "rooms",
          localField: "roomId",
          foreignField: "roomId",
          as: "roomDetails",
        },
      },
      {
        $unwind: "$roomDetails",
      },
      {
        $project: {
          _id: "$roomDetails._id",
          roomId: "$roomDetails.roomId",
          name: "$roomDetails.name",
          img: "$roomDetails.img",
          type: "$type",
          organization: "$roomDetails.organization",
          customFields: "$roomDetails.customFields",
        },
      },
    ]);

    res.status(200).json(rooms);
  } catch (err) {
    console.error("Error retrieving admin rooms:", err);
    res.status(500).json({ error: "Server error" });
  }
}


const handleGetCreate = async (req, res) => {
  const user = req.user;
  res.render("home/create", { active: "create", user });
};
const handleGetAbout = async (req, res) => {
  const user = req.user;
  res.render("home/about", { active: "about", user });
};
const handleGetProfile = async (req, res) => {
  const username = req.params.username;
  const user = req.user;
  res.render("home/profile", { active: "profile", user, username });
};

const handleLogout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error during logout:", err);
      return res.status(500).send("Internal Server Error");
    }
    res.redirect("/auth/login");
  });
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userFolder = `public/user/img`;
    fs.mkdirSync(userFolder, { recursive: true });
    cb(null, userFolder);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

const handlePostUploadImage = async (req, res) => {
  const img = `/user/img/${req.file.filename}`;
  if (req.user.profileImg !== "/icon/default-user.png") {
    fs.unlink(`public/${req.user.profileImg}`, (err) => {
      if (err) {
        console.log(err);
      }
    });
  }
  await User.updateOne({ _id: req.session.uid }, { $set: { profileImg: img } });
  res.json({ path: img });
};

const handleDeleteImage = async (req, res) => {
  const update = await User.updateOne(
    { _id: req.session.uid },
    { profileImg: "/icon/default-user.png" }
  );
  if (req.user.profileImg !== "/icon/default-user.png") {
    fs.unlink(`public/${req.user.profileImg}`, (err) => {
      if (err) {
        console.log(err);
      }
    });
  }
  res.json({ path: "/icon/default-user.png" });
};

const handleUpdatePassword = async (req, res) => {
  const { password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashpassword = await bcrypt.hash(password, salt);
  const upadte = await User.updateOne(
    { _id: req.session.uid },
    { password: hashpassword }
  );
  const success = true;
  res.json({ success });
};

const handleUpdateProfile = async (req, res) => {
  const { name, mobile, gender } = req.body;
  const update = await User.updateOne(
    { _id: req.session.uid },
    { name, mobile, gender }
  );
  const success = true;
  res.json({ success });
};

const handlePostCreateRoom = async (req, res) => {
  const { name, organization, customFields } = req.body;
  const roomId = uuidv4();

  const room = await Room.create({
    roomId,
    name,
    organization,
    customFields,
  });

  const roomUser = await RoomUsers.create({
    roomId,
    username: req.user.username,
    type: "admin",
  });

  const success = true;
  res.json({ success });
};

const handleGetCreatedRooms = async (req, res) => {
  const username = req.user.username;

  try {
    const rooms = await RoomUsers.aggregate([
      {
        $match: {
          username: username,
          type: "admin",
        },
      },
      {
        $lookup: {
          from: "rooms",
          localField: "roomId",
          foreignField: "roomId",
          as: "roomDetails",
        },
      },
      {
        $unwind: "$roomDetails",
      },
      {
        $project: {
          _id: "$roomDetails._id",
          roomId: "$roomDetails.roomId",
          name: "$roomDetails.name",
          img: "$roomDetails.img",
          organization: "$roomDetails.organization",
          customFields: "$roomDetails.customFields",
        },
      },
    ]);
    res.status(200).json(rooms);
  } catch (err) {
    console.error("Error retrieving admin rooms:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const handleGetRoomAccess = async (req, res) => {
  const roomId = req.params.roomId;
  const room = await Room.findOne({roomId});
  const user = req.user;
  res.render("home/access", { active: "access", room , user });
};

const handlePostRoomAccess = async (req, res) => {
  const roomId = req.params.roomId;
  const username = req.user.username;
  const customFields = req.body;
  await roomUser.create({
    roomId,
    username,
    customFields,
  })
};

module.exports = {
  handleGetHome,
  handleGetAvailableRooms,

  handleGetCreate,
  handleGetAbout,
  handleGetProfile,
  handleLogout,
  handlePostUploadImage,
  upload,
  handleDeleteImage,
  handleUpdatePassword,
  handleUpdateProfile,
  handlePostCreateRoom,
  handleGetCreatedRooms,
  handleGetRoomAccess,
  handlePostRoomAccess,
};
