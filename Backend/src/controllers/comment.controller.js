const postModel = require('../models/post.model')
const commentModel = require('../models/comment.model')

async function createCommentController(req, res) {
    const postId = req.params.postId

    const { text } = req.body

    if (!text || !text.trim()) {
        return res.status(400).json({
            message: "Comment can't be empty"
        })
    }

    if (!text.trim().length > 280) {
        return res.status(400).json({
            message: "Comments can't exceed 280 characters"
        })
    }

    const post = await postModel.findById(postId)

    if (!post) {
        return res.status(404).json({
            message: "Post not found"
        })
    }

    const created = await commentModel.create({
        post: postId,
        user: req.user.id,
        text: text.trim()
    })

    const comment = await commentModel
        .findById(created._id)
        .populate('user', 'username profileImage')
        .lean()

    res.status(201).json({
        message: "Comment added",
        comment
    })
}

async function getCommentController(req, res){
    const postId = req.params.postId

    const post = await postModel.findById(postId).select('_id')

    if(!post) {
        return res.status(404).json({
            message: "Post not found"
        })
    }

    const comments = await commentModel
        .find({ post: postId })
        .sort({ createdAt: 1 })
        .populate('user', 'username profileImage')
        .lean()

    res.status(200).json({
        message: "Comments Fetched!",
        comments
    })
}

async function deleteCommentController(req, res){
    const commentId = req.params.commentId

    const comment = await commentModel.findById(commentId)

    if(!comment) {
        return res.status(404).json({
            message: "Comment Not Found!"
        })
    }

    const isAuthor = comment.user.toString() === req.user.id

    if(!isAuthor){
        return res.status(409).json({
            message: "You can only delete your own comments"
        })
    }

    await commentModel.findByIdAndDelete(commentId)

    res.status(200).json({
        message: "Comment Deleted!"
    })
}

module.exports = {
    createCommentController,
    getCommentController,
    deleteCommentController
}