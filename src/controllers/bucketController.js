const AWS = require("aws-sdk")
var fs = require('fs');

AWS.config.update({ region: 'us-east-2' });

const createBucket = (req, res) => {
    const s3 = new AWS.S3({ apiVersion: "latest" })


    const bucketName = req.body.name
    // const bucketName = "jonanter"

    s3.createBucket({ Bucket: bucketName || "teste" }, (err) => {
        if (err) {
            res.status(500).send(err);
        } else {
            console.log("criado");
            res.status(200).send("bucket created")
        }
    })
}
const listBucket = (req, res) => {
    const s3 = new AWS.S3({ apiVersion: "latest" })

    s3.listBuckets((err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(data.Buckets)
            console.log(data);
        }
    })
}

const getBucket = (req, res) => {
    const s3 = new AWS.S3({ apiVersion: "latest" })

    const bucketParams = {
        Bucket: req.params.name
    }

    s3.listObjects(bucketParams, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(data)
        }
    })
}

const deleteBucket = (req, res) => {
    const s3 = new AWS.S3({ apiVersion: "latest" })

    const bucketParams = {
        Bucket: req.params.name
    }

    s3.deleteBucket(bucketParams, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(data)
        }
    })
}


const uploadObject = (req, res) => {
    const s3 = new AWS.S3({ apiVersion: 'latest' });

    const file = req.body.file;

    const fileName = "./src/uploads/" + file.key + ".jpg";

    fs.writeFile(fileName, file.base64, { encoding: 'base64' }, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("file created");


            


        }
    });


    const fileStream = fs.createReadStream(fileName);
    fileStream.on('error', function (err) {
        console.log('File Error', err);
    });

    var uploadParams = { Bucket: file.bucketName, Key: file.key, Body: fileStream };

    s3.upload(uploadParams, function (err, data) {
        if (err) {
            console.log("Error", err);
            res.status(500).send(err);
        } if (data) {
            console.log("Upload Success", data.Location);
            res.status(200).send(data.Location);
        }
    });


}

const listObjects = (req, res) => {

    const s3 = new AWS.S3({ apiVersion: 'latest' });

    var bucketParams = {
        Bucket: req.params.name,
    };

    s3.listObjects(bucketParams, function (err, data) {
        if (err) {
            res.status(500).send(err)
        } else {
            console.log(data);
            res.status(200).send(data);
        }
    });
}


const deleteObject = (req, res) => {
    const s3 = new AWS.S3({ apiVersion: 'latest' });

    console.log(req.params.bucket);
    console.log(req.params.key);

    var params = {
        Bucket: req.params.bucket,
        Key: req.params.key
    };

    s3.deleteObject(params, function (err, data) {
        if (err) {
            console.log(err, err.stack);
            res.status(500).send();
        } else {
            console.log("deleted");
            res.status(200).send({ status: "deleted" });
        }
    });
}


const downloadObject = (req, res) => {
    const s3 = new AWS.S3({ apiVersion: 'latest' });


    var fileStream = fs.createWriteStream("./src/uploads/" + req.body.objectName + ".jpg");
    var s3Stream = s3.getObject({ Bucket: req.body.bucketName, Key: req.body.objectName }).createReadStream();

    // Listen for errors returned by the service
    s3Stream.on('error', function (err) {
        // NoSuchKey: The specified key does not exist
        console.error(err);
    });

    s3Stream.pipe(fileStream).on('error', function (err) {
        // capture any errors that occur when writing data to the file
        console.error('File Stream:', err);
        res.status(500).send(err);
    }).on('close', function () {
        console.log('Done.');
        res.status(200).send();
    });
}


module.exports = {
    createBucket,
    listBucket,
    getBucket,
    deleteBucket,
    listObjects,
    uploadObject,
    deleteObject,
    downloadObject
}