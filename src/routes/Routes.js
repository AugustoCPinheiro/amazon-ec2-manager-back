const express = require("express")
const router = express.Router();
const { createInstance, listInstance, updateInstance, terminateInstance } = require("../controllers/InstanceController")
const { createBucket, listBucket, getBucket, deleteBucket } = require("../controllers/bucketController")
const instancesRoute = "/instance"
const s3Route = "/s3"

router.get(instancesRoute, listInstance)

router.post(instancesRoute, createInstance)

router.put(instancesRoute, updateInstance)

router.delete(`${instancesRoute}/:id`, terminateInstance)

router.post(s3Route, createBucket)

router.get(s3Route, listBucket)

router.get(`${s3Route}/:name`, getBucket)

router.delete(`${s3Route}/:name`. deleteBucket)

module.exports = router