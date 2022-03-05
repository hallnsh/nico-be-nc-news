const {fetchTopics} = require('../models/topics.models');
// send status 200 if successful and the topics array
exports.getTopics = (req, res, next) => {
    fetchTopics()
      .then((topics) => {
        res.status(200)
        res.send({topics});
    })
    .catch((err) => {
      next(err);
    })
  };

