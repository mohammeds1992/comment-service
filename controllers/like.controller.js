const Like = require('../models/like.model');
const User = require('../models/user.model');
const Comment = require('../models/comment.model');

async function likeComment(req, res) {
    try {
        const {
            user_id
        } = req.body;
        const {
            id
        } = req.params;
        const user = await User.getUserById(user_id);
        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }

        const comment = await Comment.getCommentById(id);

        if (!comment) {
            return res.status(404).json({
                message: 'Comment not found'
            });
        }

        // Check if the user has already liked the comment
        const existingLike = await Like.findOne({ comment_id: comment._id, user_id: user._id });
        if (existingLike) {
            return res.status(400).json({
                error: 'You have already liked this comment'
            });
        }

        // Create a new like for the comment
        const like = new Like({ comment_id: comment._id, user_id: user._id });
        await like.save();

        res.status(200).json({
            message: 'Comment liked successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Something went wrong'
        });
    }
};

async function unlikeComment(req, res) {
    try {
        const {
            user_id
        } = req.body;
        const {
            id
        } = req.params;
        const user = await User.getUserById(user_id);
        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }

        const comment = await Comment.getCommentById(id);

        if (!comment) {
            return res.status(404).json({
                message: 'Comment not found'
            });
        }

        // Check if the user has liked the comment
         const existingLike = await Like.findOne({ comment_id: comment._id, user_id: user._id });

        if (!existingLike) {
            return res.status(400).json({
                error: 'You have not liked this comment yet'
            });
        }

        // Delete the like for the comment
        await existingLike.delete();

        res.status(200).json({
            message: 'Comment unliked successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Something went wrong'
        });
    }
};

async function getLikeCount(req, res) {
  try {
    const commentId = req.params.id;

    // Check if the comment exists
    const comment = await Comment.getCommentById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Get the count of likes for the comment
    const likeCount = await Like.aggregate([
      { $match: { comment_id: comment._id } },
      { $group: { _id: '$comment_id', count: { $sum: 1 } } },
    ]);

    return res.status(200).json({ count: likeCount[0]?.count || 0 });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
    likeComment,
    unlikeComment,
    getLikeCount
};