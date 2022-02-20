const { Like } = require('../models')
const { getUser } = require('../_helpers')

const likeServices = {
  likeTweet: (req, cb) => {
    const UserId = getUser(req).id
    const TweetId = Number(req.params.id)

    return Like.findOne({
      where: {
        UserId,
        TweetId
      },
      raw: true
    })
      .then(like => {
        if (like) throw new Error('You are already liked this tweet!')
        return Like.create({
          UserId,
          TweetId
        })
      })
      .then(like => cb(null, like))
      .catch(err => cb(err))
  },
  unlikeTweet: (req, cb) => {
    const UserId = getUser(req).id
    const TweetId = Number(req.params.id)

    return Like.findOne({
      where: {
        UserId,
        TweetId
      }
    })
      .then(like => {
        if (!like) throw new Error('You have not liked this tweet!')
        return like.destroy()
      })
      .then(like => cb(null, like))
      .catch(err => cb(err))
  }
}
module.exports = likeServices
