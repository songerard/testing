const express = require('express')
const router = express.Router()
const upload = require('../../middleware/multer')
const tweetController = require('../../controllers/tweet-controller')
const likeController = require('../../controllers/like-controller')
const replyController = require('../../controllers/reply-controller')

router.post('/:id/like', likeController.likeTweet)
router.post('/:id/unlike', likeController.unlikeTweet)

router.post('/:tweet_id/replies', replyController.replyTweet)
router.get('/:tweet_id/replies', replyController.getTweetReplies)

router.get('/:tweet_id', tweetController.getTweet)
router.post('/', upload.fields([{ name: 'image', maxCount: 1 }]), tweetController.postTweet)
router.get('/', tweetController.getTweets)

module.exports = router