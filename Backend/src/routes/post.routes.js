const express = require('express')
const postRouter = express.Router()
const postController = require('../controllers/post.controller')
const commentController = require('../controllers/comment.controller')
const multer = require('multer')
const upload = multer({storage:multer.memoryStorage()})
const identifyUser = require('../middleware/auth.middleware')



postRouter.post("/",upload.single('image'), identifyUser, postController.createPostController)

postRouter.get("/", identifyUser, postController.getPostController)

postRouter.get("/details/:postId", identifyUser, postController.getPostDetailsController)

postRouter.post("/like/:postId", identifyUser, postController.likePostController)

postRouter.post("/unlike/:postId", identifyUser, postController.unLikePostController)

postRouter.get("/comments/:postId", identifyUser, commentController.getCommentController)

postRouter.post("/comments/:postId", identifyUser, commentController.createCommentController)

postRouter.delete("/comments/:commentId", identifyUser, commentController.deleteCommentController)

postRouter.get("/feed", identifyUser, postController.getFeedController)

module.exports = postRouter