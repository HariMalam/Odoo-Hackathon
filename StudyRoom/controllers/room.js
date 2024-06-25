const handleGetRoom = (req,res) => {
  const room = req.room;
  const roomUser = req.roomUser;
  res.render("room/index", {room,roomUser});
}

module.exports = {handleGetRoom};