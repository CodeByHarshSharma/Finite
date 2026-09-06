const postModel = require("../models/post.model")
const ImageKit = require("@imagekit/nodejs")
const { toFile } = require('@imagekit/nodejs')
const jwt = require('jsonwebtoken')
const likeModel = require('../models/like.model')
const commentModel = require('../models/comment.model')


const imageKit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
})

async function createPostController(req, res) {

    const { caption, content, category, type } = req.body

    if (!req.file) {
        if (!content || !content.trim()) {
            return res.status(400).json({
                message: "Text posts need content!"
            })
        }

        const post = await postModel.create({
            type: 'text',
            content,
            category: category || 'general',
            user: req.user.id
        })

        return res.status(201).json({
            message: "Post created!",
            post
        })
    }

    const file = await imageKit.files.upload({
        file: await toFile(Buffer.from(req.file.buffer), 'file'),
        fileName: "test",
        folder: "insta-clone"
    })

    const post = await postModel.create({
        type: 'image',
        caption: caption,
        imgUrl: file.url,
        category: category || 'general',
        user: req.user.id
    })

    res.status(201).json({
        message: "Post created!",
        post
    })
}

async function getPostController(req, res) {

    const userId = req.user.id

    const posts = await postModel.find({
        user: userId
    })

    res.status(200).json({
        message: "Post fetched successfully!",
        posts
    })
}

async function getPostDetailsController(req, res) {

    const userId = req.user.id
    const postId = req.params.postId

    const post = await postModel.findById(postId)

    if (!post) {
        return res.status(404).json({
            message: "Post not found!"
        })
    }

    const isValidUser = post.user.toString() === userId

    if (!isValidUser) {
        return res.status(403).json({
            message: "Forbidden Content!"
        })
    }

    res.status(200).json({
        message: "Post Fetched Successfully",
        post
    })

}

async function likePostController(req, res) {

    const username = req.user.username
    const postId = req.params.postId

    const post = await postModel.findById(postId)

    if (!post) {
        return res.status(404).json({
            message: "Post Not Found!"
        })
    }

    const alreadyLiked = await likeModel.findOne({
        post: postId,
        user: username
    })

    if (alreadyLiked) {
        return res.status(200).json({
            message: "Post already liked!",
            like: alreadyLiked
        })
    }

    const like = await likeModel.create({
        post: postId,
        user: username
    })

    res.status(200).json({
        message: "Post Liked!",
        like
    })
}

async function unLikePostController(req, res) {

    const username = req.user.username
    const postId = req.params.postId

    const isLiked = await likeModel.findOne({
        post: postId,
        user: username
    })

    if (!isLiked) {
        return res.status(400).json({
            message: "Post is not Liked!"
        })
    }

    await likeModel.findOneAndDelete({ _id: isLiked._id })

    res.status(200).json({
        message: "Post Unliked!"
    })
}

async function getFeedController(req, res) {

    const user = req.user
    const { category } = req.query

    const filter = category && category !== 'all' ? { category } : {}

    const posts = await postModel
        .find(filter)
        .sort({ _id: -1 })
        .populate('user')
        .lean()

    const postIds = posts.map(post => post._id)

    const likes = await likeModel.find({
        post: {
            $in: postIds
        }
    }).lean()

    const likesByPost = likes.reduce((acc, like) => {
        const key = like.post.toString()
        acc[key] = acc[key] || []
        acc[key].push(like.user)
        return acc
    }, {})

    const commentsCounts = await commentModel.aggregate([
        { $match: { post: { $in: postIds  } } },

        { $group: { _id: "$post", count: { $sum: 1 } } }
    ])

    const commentByPost = commentsCounts.reduce((acc, row) => {
        acc[row._id.toString()] = row.count
        return acc
    }, {})

    const feedPosts = posts.map(post => {
        const postLikes = likesByPost[post._id.toString()] || []
        post.isLiked = postLikes.includes(user.username)
        post.likeCount = postLikes.length
        return post
    })

    res.status(200).json({
        message: "Feed Loaded!",
        posts: feedPosts
    })
}

module.exports = {
    createPostController,
    getPostController,
    getPostDetailsController,
    likePostController,
    unLikePostController,
    getFeedController
}