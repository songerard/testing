const { Reply, Tweet } = require('../models')
const { getUser } = require('../_helpers')

const replyServices = {
  replyTweet: (req, cb) => {
    const UserId = getUser(req).id
    const TweetId = Number(req.params.tweet_id)
    const comment = req.body.comment.trim()
    if (!comment) throw new Error('Reply content is required!')

    return Tweet.findByPk(TweetId, { raw: true })
      .then(tweet => {
        if (!tweet) throw new Error("Tweet didn't exist!")

        return Reply.create({
          UserId,
          TweetId,
          comment
        })
      })
      .then(reply => cb(null, reply))
      .catch(err => cb(err))
  },
  getTweetReplies: (req, cb) => {
    const UserId = getUser(req).id
    const id = Number(req.params.tweet_id)

    return Tweet.find({
      where: { id },
      include: Reply
    })
      .then(tweet => {
        if (!tweet) throw new Error('Tweets not found')

        const replies = tweet.Replies
        return cb(null, replies)
      })
      .catch(err => cb(err))
  }
}
module.exports = replyServices
