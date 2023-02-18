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

        // Check if title and description are not empty
        if (!title || !description) {
            return res.status(400).json({
                message: "Title and description are mandatory"
            });
        }

        if (title.length > 100) {
            return res.status(400).json({
                message: "Title should be less than 100 characters"
            });
        }

        if (description.length > 1000) {
            return res.status(400).json({
                message: "Description should be less than 1000 characters"
            });
        }

        // Check if personality_types is an array containing only valid personality types
        const validPersonalityTypes = ['MBTI', 'Enneagram', 'Zodiac'];
        if (!Array.isArray(personality_types) || personality_types.some(pt => !validPersonalityTypes.includes(pt))) {
            return res.status(400).json({
                message: "Invalid personality types"
            });
        }

        const user = await User.getUserById(user_id);
        if (!user) {
            res.status(404).json({
                message: `User with id ${user_id} not found`,
            });
            return;
        }


        const date = new Date();
        const _id = getNextCommentId();

        const comment = new Comment({
            comment_id: _id,
            title: title,
            description: description,
            personality_types: personality_types,
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
            "error": "Server error"
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
            comment_id
        } = req.params;

        const comment = await Comment.getCommentById(comment_id);
        if (!comment) {
            return res.status(404).json({
                message: `Comment with id ${comment_id} not found`,
            });
        }

        // Check if title and description are not empty
        if (!title || !description) {
            return res.status(400).json({
                message: "Title and description are mandatory"
            });
        }

        if (title.length > 100) {
            return res.status(400).json({
                message: "Title should be less than 100 characters"
            });
        }

        if (description.length > 1000) {
            return res.status(400).json({
                message: "Description should be less than 1000 characters"
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
            "error": "Server error"
        });
    }
};

const deleteComment = async (req, res) => {
    try {
        const {
            comment_id
        } = req.params;

        const comment = await Comment.getCommentById(comment_id);
        if (!comment) {
            return res.status(404).json({
                message: `Comment with id ${comment_id} not found`,
            });
        }

        await comment.remove();
        res.status(200).json({
            message: "Comment deleted"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            "error": "Server error"
        });
    }
};

async function getComment(req, res) {
    try {
        const comment = await Comment.getCommentById(req.params.comment_id);
        if (!comment) {
            return res.status(404).json({
                message: `Comment with id ${req.params.comment_id} not found`,
            });
        }
        res.status(200).json(
            comment
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({
            "error": "Server error"
        });
    }
}

async function getComments(req, res) {

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const sort = req.query.sort || 'desc';
    const skip = (page - 1) * pageSize;

    const personality_types = Array.isArray(req.query.personality_types) ? req.query.personality_types : req.query.personality_types ? [req.query.personality_types] : [];

    const validPersonalityTypes = ['MBTI', 'Enneagram', 'Zodiac'];
    if (personality_types.length > 0 && personality_types.some(pt => !validPersonalityTypes.includes(pt))) {
        return res.status(400).json({
            message: "Invalid personality types"
        });
    }

    let sortOption = {};
    if (sort === 'asc') {
        sortOption = {
            created_at: 1
        };
    } else if (sort === 'likes') {
        sortOption = {
            like_count: -1
        };
    } else {
        sortOption = {
            created_at: -1
        };
    }

    const filterOption = {};
    if (personality_types.length > 0) {
        filterOption.personality_types = {
            $in: personality_types
        };
    }

    const comments = await Comment.find(filterOption)
        .sort(sortOption)
        .skip(skip)
        .limit(pageSize)
        .populate('created_by', 'name')
        .lean();


    const totalComments = await Comment.countDocuments(filterOption);

    const totalPages = Math.ceil(totalComments / pageSize);

    res.json({
        comments,
        page,
        pageSize,
        totalPages,
        totalComments,
    });
}

module.exports = {
    createComment,
    updateComment,
    deleteComment,
    getComment,
    getComments
};