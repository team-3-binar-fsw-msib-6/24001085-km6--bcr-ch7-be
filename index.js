require("dotenv").config()

const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const router = require("./route")

const http = require("http")
const { Server } = require("socket.io")

const app = express()
app.use(express.static("public"))

const server = http.createServer(app)

const port = process.env.PORT || 4000

const { Sequelize } = require("sequelize")

const sequelize = new Sequelize(
  process.env.POSTGRES_DATABASE,
  process.env.POSTGRES_USERNAME,
  process.env.POSTGRES_PASSWORD,
  {
    host: process.env.POSTGRES_HOST,
    dialect: "postgres",
  }
)

const Vote = require("./models/vote")(sequelize, Sequelize)

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

app.use(cors())

app.use(express.json()) // body -> json

app.use("/", router)

app.use("*", (req, res) => {
  res.status(404).json({
    data: null,
    message: "Route not found",
  })
})

server.listen(port, () => {
  console.log("Server is running on port " + port)
})
