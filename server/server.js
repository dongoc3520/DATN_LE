const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const http = require("http");
const socketIo = require("socket.io");
const db = require("./src/models");
const cors = require("cors");
const app = express();
const multer = require("multer");
const path = require("path");
// cors
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "PUT", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.set("trust proxy", 1);

//cookie parser
app.use(cookieParser());

//body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//port
const port = 5555;

//server soketio = server
const server = http.createServer(app);
export const io = socketIo(server, {
  cors: {
    origin: true,
    credentials: true,
  },
});

app.get("/hehe", (req, res) => {
  res.send("hello world");
});
const userRouter = require("./src/routes/routeruser");
app.use("/user", userRouter);

const postRouter = require("./src/routes/routerpost");
app.use("/post", postRouter);

const friendRouter = require("./src/routes/routerfriend");
app.use("/friend", friendRouter);

// const commentRouter = require("./src/routes/routercomment");
// app.use("/comment", commentRouter);

const messRouter = require("./src/routes/routermess");
app.use("/mess", messRouter);

// const videoRouter = require("./src/routes/routerVideo");
// app.use("/video", videoRouter);

// const LikeRouter = require("./src/routes/routerLike");
// app.use("/like", LikeRouter);

//connectdb and start server
db.sequelize.sync().then(() => {
  server.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
});
