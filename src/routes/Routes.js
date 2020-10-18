const express = require("express")
const router = express.Router();
const { createInstance, listInstance } = require("../controllers/InstanceController")

const instancesRoute = "/instance"

router.get(instancesRoute, listInstance)

router.post(instancesRoute, createInstance)

module.exports = router