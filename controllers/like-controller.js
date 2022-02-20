const likeServices = require('../services/like-services')

const likeController = {
  likeTweet: (req, res, next) => {
    likeServices.likeTweet(req, (err, data) => err ? next(err) : res.json(data))
  },
  unlikeTweet: (req, res, next) => {
    likeServices.unlikeTweet(req, (err, data) => err ? next(err) : res.json(data))
  }
}
module.exports = likeController
