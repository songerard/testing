const { User, Followship } = require('../models')
const { getUser } = require('../_helpers')

const followshipServices = {
  addFollowing: (req, cb) => {
    const userId = getUser(req).id
    const toBeFollowedUserId = Number(req.body.followingId)

    return Promise.all([
      User.findByPk(toBeFollowedUserId),
      Followship.findOne({
        where: {
          followerId: userId,
          followingId: toBeFollowedUserId
        }
      })
    ])
      .then(([user, followship]) => {
        if (!user) throw new Error("User didn't exist!")
        if (followship) throw new Error('You are already following this user!')
        return Followship.create({
          followerId: userId,
          followingId: toBeFollowedUserId
        })
      })
      .then(followship => cb(null, followship))
      .catch(err => cb(err))
  },
  removeFollowing: (req, cb) => {
    const userId = getUser(req).id
    const toBeRemovedFollowingUserId = Number(req.params.id)
    return Followship.findOne({
      where: {
        followerId: userId,
        followingId: toBeRemovedFollowingUserId
      }
    })
      .then(followship => {
        if (!followship) throw new Error("You haven't followed this user!")
        return followship.destroy()
      })
      .then(followship => cb(null, followship))
      .catch(err => cb(err))
  }
}
module.exports = followshipServices
