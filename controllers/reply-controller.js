const replyServices = require('../services/reply-services')

const replyController = {
  replyTweet: (req, res, next) => {
    replyServices.replyTweet(req, (err, data) => err ? next(err) : res.json(data))
  },
  getTweetReplies: (req, res, next) => {
    replyServices.getTweetReplies(req, (err, data) => err ? next(err) : res.json(data))
  }
}
module.exports = replyController
