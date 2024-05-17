require("dotenv").config();
const fileUpload = require("express-fileupload");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Server } = require("socket.io");

const express = require("express");
const router = require("./route");
const voteUsecase = require("./usecase/vote");

const http = require("http");

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: process.env.NODE_ENV == "development" ? "./tmp" : "/tmp",
  })
);
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: "*",
  },
});

app.use(async (req, res, next) => {
  req.io = io;
  next();
});

app.use("/api", router);

app.use("*", (req, res) => {
  res.status(404).json({
    data: null,
    message: "Route not found",
  });
});

// Error middleware
app.use((err, req, res, next) => {
  let statusCode = 500;
  let message = "Internal Server Error";

  if (err.statusCode) {
    statusCode = err.statusCode;
  }
  if (err.message) {
    message = err.message;
  }

  res.status(statusCode).json({
    data: null,
    message,
  });
});

io.on("connection", async (socket) => {
  console.log(socket.id + " connected!");
  const votes = await voteUsecase.getVotes();

  io.sockets.emit("update", votes);
  socket.broadcast.emit("update", votes);
  // io.emit("update", votes);

  socket.on("vote", async () => {
    const votes = await voteUsecase.getVotes();
    io.sockets.emit("update", votes);
    socket.broadcast.emit("update", votes);

    // io.emit("update", votes);
  });
});

server.listen(port, () => console.log(`Server running on port ${port}`));
