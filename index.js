const express = require("express");
const cors = require("cors")
const bodyParser = require('body-parser');
const appRouter = require("./src/routes/Routes")
const app = express()

app.use(bodyParser.json({ limit: 1000000 }));

app.use(cors())
app.use(express.json())
app.use(appRouter)
app.listen(8080)