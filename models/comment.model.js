const mongoose = require('mongoose');

// Define the comment schema
const commentSchema = new mongoose.Schema({
    id: {
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
    personality_type: [{
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
});

commentSchema.statics.getCommentById = async function(id) {
    return await this.findOne({
        id
    });;
};

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;