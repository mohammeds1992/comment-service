const Comment = require('../models/comment.model');
const User = require('../models/user.model');
const {
    getNextCommentId
} = require('../utils/counter');


async function createComment(req, res) {
    try {
        const {
            title,
            description,
            personality_types,
            user_id
        } = req.body;

        const user = await User.getUserById(user_id);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const date = new Date();
        const _id = getNextCommentId();

        const comment = new Comment({
            id: _id,
            title: title ,
            description: description,
            personality_type: personality_types,
            created_by: user,
            created_at: date,
            last_modified_at: date,
        });

        const savedComment = await comment.save();
        res.status(201).json(
            
            savedComment
        );
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Server error"
        });
    }
};

const updateComment = async (req, res) => {
    try {
        const {
            title,
            description
        } = req.body;
        const {
            id
        } = req.params;

        const comment = await Comment.getCommentById(id);
        if (!comment) {
            return res.status(404).json({
                message: "Comment not found"
            });
        }

        comment.title = title;
        comment.description = description;
        comment.last_modified = Date.now();

        const updatedComment = await comment.save();
        res.status(200).json(
          
            updatedComment
        );
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Server error"
        });
    }
};

const deleteComment = async (req, res) => {
    try {
        const {
            id
        } = req.params;

        const comment = await Comment.getCommentById(id);
        if (!comment) {
            return res.status(404).json({
                message: "Comment not found"
            });
        }

        await comment.remove();
        res.status(200).json({
            message: "Comment deleted"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Server error"
        });
    }
};

async function getComment(req, res) {
  try {
    const comment = await Comment.getCommentById(req.params.id);
    if (!comment) {
      res.status(404).render('error_template', {
        message: `Comment with id ${req.params.id} not found`,
      });
      return;
    }
        res.status(200).json(
          
            comment
        );
  } catch (error) {
    console.error(error);
    res.status(500).render('error_template', {
      message: 'Server error',
    });
  }
}

module.exports = {
    createComment,
    updateComment,
    deleteComment,
    getComment
};