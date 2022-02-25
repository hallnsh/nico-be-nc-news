const {fetchUserNames, fetchEndpointInfo} = require('../models/users.models');
//const jsonfile = require(`../endpoints.json`)

exports.getUsers = (req, res, next) => {
    fetchUserNames()
      .then((userNames) => {
        res.status(200)
        res.send({userNames});
    })
    .catch((err) => {
      next(err);
    })
  };
  
exports.getEndpointInfo = (req, res, next) => {
  const endpointjsonFile = 'endpoints.json';
  fetchEndpointInfo(endpointjsonFile)
  .then((jsonData) => {
    res.status(200)
  //  res.send({jsonData});
    res.send(jsonData);
  })
  .catch((err) => {
  //  console.log('the error object in getEndpointInfo',err)
      next(err);
  })
};