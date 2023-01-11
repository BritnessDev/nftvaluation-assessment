/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

// Load the AWS SDK for Node.js
const AWS = require('aws-sdk')

// Set the region 
AWS.config.update({ region: 'eu-central-1' })

// Create EC2 service object
var ec2 = new AWS.EC2({ apiVersion: '2016-11-15' })

// The EC2 Instance ID
var params = {
  InstanceIds: ['i-00c2aa648eb19027b']
}

// Function to stop the instance
ec2.startInstances(params, function (err, data) {
  if (err) {
    console.log(err, err.stack)
    throw new Error(err)
  } else {
    console.log(data)
    console.log('Previous State:', data.StartingInstances[0].PreviousState)
    console.log('Current State:', data.StartingInstances[0].CurrentState)
  }
})

// Function to wait for started instance Status Check to be OK
ec2.waitFor('instanceStatusOk', params, function (err, data) {
  if (err) {
    console.log(err, err.stack)
    throw new Error(err)
  } else {
    console.log(data)
  }
})