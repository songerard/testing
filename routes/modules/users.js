const express = require('express')
const router = express.Router()
const upload = require('../../middleware/multer')
const userController = require('../../controllers/user-controller')

router.get('/:id/followings', userController.getUserFollowings)
router.get('/:id/followers', userController.getUserFollowers)
router.get('/:id/replied_tweets', userController.getUserRepliedTweets)
router.get('/:id/likes', userController.getUserLikedTweets)
router.get('/:id/tweets', userController.getUserTweets)
router.put('/:id', upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), userController.putUser)
router.get('/:id', userController.getUserInfo)

module.exports = router