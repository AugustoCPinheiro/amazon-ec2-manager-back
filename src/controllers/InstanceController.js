const AWS = require("aws-sdk")

const listInstance = (req, res) => {
  AWS.config.update({ region: 'us-east-2' });
  const ec2 = new AWS.EC2({ apiVersion: 'latest' });

  ec2.describeInstances({ DryRun: false }, (err, data) => {
    if (err) {
      res.status(500).send()
    } else {
      res.status(200).send(data)
    }
  });
}

const createInstance =  (req, res) => {
  AWS.config.update({ region: 'us-east-2' });

  const instanceParams = {
    ImageId: 'ami-03657b56516ab7912',
    InstanceType: 't2.micro',
    KeyName: 'Top. comp.',
    MinCount: 1,
    MaxCount: 1,
  };

  const instancePromise = new AWS.EC2({ apiVersion: 'latest' })
    .runInstances(instanceParams)
    .promise();

  instancePromise
    .then((data) => {
    console.log(data);
    const instanceId = data.Instances[0].InstanceId;
    console.log('Created instance', instanceId);
    const tagParams = {
        Resources: [instanceId],
        Tags: [
        {
            Key: 'Name',
            Value: 'SDK Sample',
        },
        ],
    };
    // Create a promise on an EC2 service object
    const tagPromise = new AWS.EC2({ apiVersion: 'latest' })
        .createTags(tagParams)
        .promise();
    // Handle promise's fulfilled/rejected states
    tagPromise
        .then((data) => {
        console.log('Instance tagged');
        res.status(200).send(data)
        })
        .catch((err) => {
        res.status(500).send(err) 
        console.error(err, err.stack);
        });
    })
    .catch((err) => {
    res.status(500).send(err) 
    console.error(err, err.stack);
    });
}

const updateInstance = (req, res) => {
  AWS.config.update({region: "us-east-2"});

  const ec2 = new AWS.EC2({ apiVersion: 'latest' });
  
  const InstanceIds = req.body.instanceIds ? req.body.instanceIds : []
  
  const params = {
    InstanceIds,
    DryRun: true,
  }
  if(req.body.action === "STOP"){
    ec2.stopInstances(params, (err, data) => {
      if (err && err.code === 'DryRunOperation') {
        params.DryRun = false;
        ec2.stopInstances(params, function(err, data) {
            if (err) {
              res.status(500).send(err)
              console.log("Error", err);
            } else if (data) {
              res.status(200).send(data)
              console.log("Success", data.StoppingInstances);
            }
        });
      } else {
        res.status(500).send("no permission")
        console.log("You don't have permission to stop instances");
      }
    })
    return
  }

  if(req.body.action === "START"){
    ec2.startInstances(params, function(err, data) {
      if (err && err.code === 'DryRunOperation') {
        params.DryRun = false;
        ec2.startInstances(params, function(err, data) {
            if (err) {
              res.status(500).send(err)
              console.log("Error", err);
            } else if (data) {
              res.status(200).send(data)
              console.log("Success", data.StartingInstances);
            }
        });
      } else {
        res.status(500).send("no permission")
        console.log("You don't have permission to start instances.");
      }
    });
    return 
  }
  res.status(404).send("action not found")
} 

module.exports = { createInstance, listInstance, updateInstance }