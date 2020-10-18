const express = require("express");
const cors = require("cors")

const appRouter = require("./src/routes/Routes")
const app = express()

app.use(cors())
app.use(express.json())
app.use(appRouter)
app.listen(8080)