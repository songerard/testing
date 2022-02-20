const { Tweet, User, Reply, Following } = require('../models')
const { getUser } = require('../_helpers')
const { imgurFileHandler } = require('../helpers/file-helpers')

const tweetServices = {
  getTweets: (req, cb) => {
    const UserId = getUser(req).id

    return User.findByPk(UserId, {
      include: [
        { model: Tweet },
        {
          model: User, as: 'Followings',
          include: { model: Tweet, include: User }
        }
      ]
    })
      .then(user => {
        if (!user) throw new Error('User does not found')

        const tweets = user.Followings.reduce((accumulator, currentFollowing) =>
          accumulator.concat(...currentFollowing.Tweets), user.Tweets).sort((a, b) => b.createdAt - a.createdAt)

        return cb(null, tweets)
      })
      .catch(err => cb(err))
  },
  postTweet: (req, cb) => {
    const description = req.body.description.trim()
    const UserId = getUser(req).id

    if (!description) throw new Error('Tweet content is required!')

    const { files } = req
    return imgurFileHandler(files.image)
      .then(filePath => {
        return Tweet.create({
          UserId,
          description,
          image: filePath
        })
      })
      .then(tweet => cb(null, tweet))
      .catch(err => cb(err))
  },
  getTweet: (req, cb) => {
    const UserId = getUser(req).id
    const id = Number(req.params.tweet_id)

    return Tweet.find({
      where: { id },
      include: Reply
    })
      .then(tweets => {
        if (!tweets) throw new Error('Tweets not found')
        return cb(null, tweets)
      })
      .catch(err => cb(err))
  }
}

module.exports = tweetServices
