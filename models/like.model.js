const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    comment_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        required: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like
