const {fetchTopics} = require('../models/topics.models');

exports.getTopics = (req, res, next) => {
    fetchTopics()
      .then((topics) => {
      /**
       * implement the fetchTopics model function and complete the controller
       * by responding with the topics to pass the first set of tests
       */
        console.log ('In getTopics');
        res.status(200)
        res.send({topics});
    })
    .catch((err) => {
      console.log(err);
      next(err);
    })
  };

