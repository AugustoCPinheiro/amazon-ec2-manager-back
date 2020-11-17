const AWS = require("aws-sdk")

AWS.config.update({region: 'us-east-2'});

const createBucket = (req, res) => {
    const s3 = new AWS.S3({apiVersion: "latest"})
    
    const bucketName = req.body.name

    s3.createBucket({Bucket: bucketName || "teste"}, () => {
        if(err){
            res.status(500).send(err)
        }else{
            res.status(200).send("bucket created")
        }
    })
}
const listBucket = (req, res) => {
    const s3 = new AWS.S3({apiVersion: "latest"})

    s3.listBuckets((err, data) => {
        if(err){
            res.status(500).send(err)
        }else{
            res.status(200).send(data.Buckets)
        }
    })
}

const getBucket = (req, res) => {
    const s3 = new AWS.S3({apiVersion: "latest"})

    const bucketParams = {
        Bucket: req.params.name
    }

    s3.listObjects(bucketParams, (err, data) => {
        if(err){
            res.status(500).send(err)
        }else{
            res.status(200).send(data)
        }
    })
}

const deleteBucket = (req, res) => {
    const s3 = new AWS.S3({apiVersion: "latest"})

    const bucketParams = {
        Bucket: req.params.name
    }

    s3.deleteBucket(bucketParams, (err, data) => {
        if(err){
            res.status(500).send(err)
        }else{
            res.status(200).send(data)
        }
    })
}
module.exports = {
    createBucket,
    listBucket,
    getBucket,
    deleteBucket
}