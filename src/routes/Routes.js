const express = require("express")
const router = express.Router();
const { createInstance, listInstance, updateInstance, terminateInstance } = require("../controllers/InstanceController")

const instancesRoute = "/instance"

router.get(instancesRoute, listInstance)

router.post(instancesRoute, createInstance)

router.put(instancesRoute, updateInstance)

router.delete(`${instancesRoute}/:id`, terminateInstance)

module.exports = router