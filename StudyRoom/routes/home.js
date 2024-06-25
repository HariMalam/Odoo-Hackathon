const express = require("express");
const router = express.Router();

const {
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
} = require("../controllers/home");

router.get("/", handleGetHome);

router.get("/available-rooms", handleGetAvailableRooms);
router.post("/create-room",handlePostCreateRoom);
router.get("/created-rooms",handleGetCreatedRooms);

router.get("/profile/:username", handleGetProfile);
router.post("/upload-image", upload.single("image"), handlePostUploadImage);
router.delete("/delete-image", handleDeleteImage);
router.patch("/update-password", handleUpdatePassword);
router.patch("/update-profile", handleUpdateProfile);

router.get("/access/:roomId",handleGetRoomAccess);
router.post("/access/:roomId",handlePostRoomAccess);

router.get("/about", handleGetAbout);
router.get("/logout", handleLogout);

module.exports = router;
