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
    const tagPromise = new AWS.EC2({ apiVersion: '2016-11-15' })
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

module.exports = { createInstance, listInstance }