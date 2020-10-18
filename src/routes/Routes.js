const express = require("express")
const router = express.Router();
const { createInstance, listInstance, updateInstance } = require("../controllers/InstanceController")

const instancesRoute = "/instance"

router.get(instancesRoute, listInstance)

router.post(instancesRoute, createInstance)

router.put(instancesRoute, updateInstance)

module.exports = router