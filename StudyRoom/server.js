const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');

mongoose.connect("mongodb://127.0.0.1:27017/StudyRoom").then(() => {
  console.log("MongoDB localhost database connected");
}).catch(err => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});

const app = express();
app.use(express.json());

const generateSecretKey = () => {
  const crypto = require('crypto');
  return crypto.randomBytes(32).toString('hex');
};

app.use(session({
  secret: generateSecretKey(),
  resave: false,
  saveUninitialized: true
}));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

const authRouter = require('./routes/auth');
const homeRouter = require('./routes/home');
const roomRouter = require('./routes/room');
const {restrictToLoggedinUserOnly, restrictToRoomUserOnly} = require('./middlewares/auth');
const {handleServerLog} = require("./middlewares/log");

app.use(handleServerLog);
app.use('/auth', authRouter);
app.use(restrictToLoggedinUserOnly);
app.use('/', homeRouter);
app.use(restrictToRoomUserOnly);
app.use('/room/:roomId',roomRouter);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
    console.log(`Server Running on localhost:${PORT}`);
});
