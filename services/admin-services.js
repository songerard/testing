const { User, Tweet } = require('../models')
const { getUser } = require('../_helpers')

const adminServices = {
  getUsers: (req, cb) => {
    return User.findAll({ raw: true })
      .then(user => cb(null, user))
      .catch(err => cb(err))
  },
  deleteTweet: (req, cb) => {
    const tweetId = Number(req.params.id)

    return Tweet.findByPk(tweetId)
      .then(tweet => {
        if (!tweet) throw new Error("Tweet didn't exist!'")
        return tweet.destroy()
      })
      .then(tweet => cb(null, tweet))
      .catch(err => cb(err))
  }
}
module.exports = adminServices
