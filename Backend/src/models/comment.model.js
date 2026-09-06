const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'posts',
        requried: [true, "PostID is required"]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: [true, ]
    },
    text: {
        type: String,
        required: [true, "Comment Text is required"],
        trim: true,
        maxlength: [280, "Comments can't exceed 280 characters"]
    }
}, { timestamps: true })

commentSchema.index({ post: 1, createdAt: -1 })

const commentModel = mongoose.model('comments', commentSchema)

module.exports = commentModel