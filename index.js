require("dotenv").config()

const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const router = require("./route")

const app = express()
const port = process.env.PORT || 4000

app.use(cors())

app.use(express.json()) // body -> json

app.use(express.static("public"))

app.use("/", router)

app.use("*", (req, res) => {
  res.status(404).json({
    data: null,
    message: "Route not found",
  })
})

app.listen(port, () => {
  console.log("Server is running on port " + port)
})
