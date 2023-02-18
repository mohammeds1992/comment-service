const mongoose = require('mongoose');

// Define the comment schema
const commentSchema = new mongoose.Schema({
    comment_id: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    personality_types: [{
        type: String,
        enum: ['MBTI', 'Enneagram', 'Zodiac'],
        required: true,
    }],
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    last_modified_at: {
        type: Date,
        default: Date.now,
    },
    like_count: {
        type: Number,
        default: 0
    }
});

commentSchema.statics.getCommentById = async function(comment_id) {
    return await this.findOne({
        comment_id: comment_id
    });;
};

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;