const bcrypt = require('bcryptjs')
const { User, Tweet, Reply, Like } = require('../models')
const { getUser } = require('../_helpers')
const { imgurFileHandler } = require('../helpers/file-helpers')

const userServices = {
  signUp: (req, cb) => {
    const { account, name, email, password, checkPassword } = req.body
    if (password !== checkPassword) throw new Error('Passwords do not match!')

    return User.findAll({
      $or: [
        { where: { account } },
        { where: { email } },
        { where: { name } }
      ]
    })
      .then(users => {
        if (users.some(u => u.email === email)) throw new Error('Email already exists!')
        if (users.some(u => u.account === account)) throw new Error('Account already exists!')
        if (users.some(u => u.name === name)) throw new Error('Name already exists!')

        return bcrypt.hash(password, 10)
      })
      .then(hash => {
        return User.create({
          account,
          password: hash,
          name,
          email,
          role: ''
        })
      })
      .then(newUser => {
        const user = newUser.toJSON()
        delete user.password
        return cb(null, user)
      })
      .catch(err => cb(err))
  },
  putUser: (req, cb) => {
    const { name, email, password, checkPassword, introduction } = req.body
    if (password !== checkPassword) throw new Error('Passwords do not match!')
    if (!name) throw new Error('Name is required!')
    if (!email) throw new Error('Email is required!')

    const { files } = req
    return Promise.all([
      User.findByPk(req.params.id),
      imgurFileHandler(files.avatar),
      imgurFileHandler(files.cover)
    ])
      .then(([user, avatarPath, coverPath]) => {
        if (!user) throw new Error("User didn't exist!")
        return user.update({
          name,
          email,
          password,
          avatar: avatarPath || user.avatar,
          introduction,
          cover: coverPath || user.cover
        })
      })
      .then(user => cb(null, user))
      .catch(err => cb(err))
  },
  getUserInfo: (req, cb) => {
    const UserId = getUser(req).id
    const getUserId = Number(req.params.id)
    
    return User.findByPk(getUserId, { raw: true })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")

        user.mySelf = user.id === UserId
        return cb(null, user)
      })
      .catch(err => cb(err))
  },
  getUserTweets: (req, cb) => {
    const UserId = getUser(req).id
    const getUserId = Number(req.params.id)

    return Promise.all([
      User.findByPk(getUserId, {
        include: [
          { model: User, as: 'Followings' },
          { model: User, as: 'Followers' }
        ]
      }),
      Tweet.findAll({
        where: { UserId: getUserId },
        order: [
          ['createdAt', 'DESC']
        ],
        raw: true
      }),
      Like.findAll({ raw: true })
    ])
      .then(([user, tweets, likes]) => {
        if (!user) throw new Error("User didn't exist!")

        const userObj = user.toJSON()
        const isFollowed = userObj.Followers.some(f => f.id === UserId)
        const isFollowing = userObj.Followings.some(f => f.id === UserId)

        const tweetsWithLike = tweets.map(t => ({
          ...t,
          tweetIsLiked: likes.some(like => like.UserId === UserId && like.TweetId === t.id),
          tweetLikeCounts: likes.filter(like => like.TweetId === t.id).length
        }))

        return cb(null, {
          tweets: tweetsWithLike,
          isFollowed,
          isFollowing
        })
      })
      .catch(err => cb(err))
  },
  getUserFollowings: (req, cb) => {
    const UserId = getUser(req).id
    const getUserId = Number(req.params.id)

    return User.findByPk(getUserId, {
      include: [
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' }
      ]
    })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")

        const userObj = user.toJSON()
        const isFollowed = userObj.Followers.some(f => f.id === UserId)
        const isFollowing = userObj.Followings.some(f => f.id === UserId)

        return cb(null, {
          followings: user.Followings,
          isFollowed,
          isFollowing
        })
      })
      .catch(err => cb(err))
  },
  getUserFollowers: (req, cb) => {
    const UserId = getUser(req).id
    const getUserId = Number(req.params.id)

    return User.findByPk(getUserId, {
      include: [
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' }
      ]
    })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")

        const userObj = user.toJSON()
        const isFollowed = userObj.Followers.some(f => f.id === UserId)
        const isFollowing = userObj.Followings.some(f => f.id === UserId)

        return cb(null, {
          followers: user.Followers,
          isFollowed,
          isFollowing
        })
      })
      .catch(err => cb(err))
  },
  getUserRepliedTweets: (req, cb) => {
    const UserId = getUser(req).id
    const getUserId = Number(req.params.id)

    return Promise.all([
      Reply.findAll({
        where: { UserId: getUserId },
        include: { model: Tweet },
        nest: true,
        raw: true
      }),
      User.findByPk(getUserId, {
        include: [
          { model: User, as: 'Followings' },
          { model: User, as: 'Followers' }
        ]
      }),
    ])
      .then(([replies, user]) => {
        if (!user) throw new Error("User didn't exist!")

        const userObj = user.toJSON()
        const isFollowed = userObj.Followers.some(f => f.id === UserId)
        const isFollowing = userObj.Followings.some(f => f.id === UserId)

        const repliedTweets = replies.reduce((accumulator, currentReply) =>
          accumulator.concat(accumulator.find(tweet => tweet.id === currentReply.TweetId) ? [] : [currentReply.Tweet]), [])

        return cb(null, {
          replies,
          repliedTweets,
          isFollowed,
          isFollowing
        })
      })
      .catch(err => cb(err))
  },
  getUserLikedTweets: (req, cb) => {
    const UserId = getUser(req).id
    const getUserId = Number(req.params.id)

    return Promise.all([
      Like.findAll({
        where: { UserId: getUserId },
        include: { model: Tweet },
        nest: true,
        raw: true
      }),
      User.findByPk(getUserId, {
        include: [
          { model: User, as: 'Followings' },
          { model: User, as: 'Followers' }
        ]
      }),
    ])
      .then(([likes, user]) => {
        if (!user) throw new Error("User didn't exist!")

        const userObj = user.toJSON()
        const isFollowed = userObj.Followers.some(f => f.id === UserId)
        const isFollowing = userObj.Followings.some(f => f.id === UserId)

        return cb(null, {
          likes,
          isFollowed,
          isFollowing
        })
      })
      .catch(err => cb(err))
  }
}

module.exports = userServices