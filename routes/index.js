var express = require('express');
var request = require('request');
var router = express.Router();

// Try to get the running region
/*
//-----------------------------------
//       This is for local
//-----------------------------------
var gcloud = require('google-cloud');

var resource = gcloud.resource({
  projectId: 'svcp-simplelocation',
  keyFilename: './svcp-simplelocation-5aabb7346046.json'
});

var project = resource.project('svcp-simplelocation');
console.log("project from GCloud: %j", project);

var metadata;
var apiResponse;
project.getMetadata().then(function(data) {
  metadata = data[0];
  apiResponse = data[1];
});

console.log("apiResponse from GCloud: %j", apiResponse);
console.log("Metadata from GCloud: %j", metadata);

*/


/*
// This is for on GCloud
var gcloud = require('google-cloud');
var resource = gcloud.resource();
var project = resource.project('svcp-simplelocation');
var projectMetadata;

project.getMetadata(function(err, metadata, apiResponse) {
  projectMetadata = metadata;
});

var vmMetadata;

var gce = gcloud.compute();
gce.getVMsStream()
  .on('error', console.error)
  .on('data', function(vm) {
    vm.getMetadata(function(err, metadata, apiResponse) {
      vmMetadata = metadata;
    });
  })
  .on('end', function() {
    // All vms retrieved.
  });
*/
// -----------------------------------------------------------------------
//                    Getting instance metadata
//
//   https://cloud.google.com/compute/docs/storing-retrieving-metadata
//------------------------------------------------------------------------
var zoneData = "Zone Unknown"

var options = {
  url: 'http://metadata/computeMetadata/v1/instance/zone?alt=text',
  headers: {
    'Metadata-Flavor': 'Google'
  }
};

var inAsia = false;
var inEuro = false;
function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    var n = body.lastIndexOf('/');
    zoneData = body.substring(n + 1);
    if (zoneData.indexOf('asia-') > -1) {
      inAsia = true;
    }
    else if (zoneData.indexOf('europe-') > -1) {
      inEuro = true;
    }
  }
}
request(options, callback);
//inAsia = true;
//inEuro = true;

/* GET home page. */
router.get('/', function(req, res, next) {
  if (inAsia) {
    res.render('asiaIndex', { params: { title: 'Home Page', location: zoneData}});
  }
  else if (inEuro) {
    res.render('euroIndex', { params: { title: 'Home Page', location: zoneData}});
  }
  else {
    res.render('defaultIndex', { params: { title: 'Home Page', location: zoneData}});
  }
});

/* Live */
router.get('/live', function(req, res) {
  if (inAsia) {
    res.render('asiaLive', { params: {title: 'Live Page'}});
  }
  else if (inEuro) {
    res.render('euroLive', { params: {title: 'Live Page'}});
  }
  else {
    res.render('defaultLive', { params: {title: 'Live Page'}});
  }
});

/* Status */
router.get('/status', function(req, res) {
  if (inAsia) {
    res.render('asiaStatus', { params: {title: 'Status Page', status: "Everything is sugoi!"}});
  }
  else if (inEuro) {
    res.render('euroStatus', { params: {title: 'Status Page', status: "Everything is cool!"}});
  }
  else {
    res.render('defaultStatus', { params: {title: 'Status Page', status: "Everything is A-OK!"}});
  }
});

module.exports = router;
