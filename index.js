require("dotenv").config();
const fileUpload = require("express-fileupload");
const cors = require("cors");
const bodyParser = require("body-parser");

const express = require("express");
const router = require("./route");

const http = require("http")
const { Server } = require("socket.io")


const app = express()
const port = process.env.PORT || 3000
app.use(cors())
app.use(express.json());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: process.env.NODE_ENV == "development" ? "./tmp" : "/tmp", // if you're using GCP App Engine please don't comment this, because the ./tmp directory is read only and we need write too so we use /tmp
  })
);
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
})

io.on("connection", async (socket) => {
  const votes = await Vote.findAll()

  socket.emit("update", votes)

  socket.on("vote", async (payload) => {
    const user = await Vote.findAll({ where: { email: payload.email } })

    if (user.length > 0) {
      await Vote.update(
        { vote: payload.voteNumber },
        { where: { email: payload.email } }
      )
    } else {
      await Vote.create({ email: payload.email, vote: payload.voteNumber })
    }

    const votes = await Vote.findAll()
    io.emit("update", votes)
  })
})

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

app.listen(port, () => console.log(`Server running on port ${port}`));
