const Vote = require('../models/vote.model');
const Comment = require('../models/comment.model');
const User = require('../models/user.model');

async function vote(req, res) {
    try {
        const {
            user_id,
            personality_type,
            personality_type_tag
        } = req.body;

        const {
            comment_id
        } = req.params;

        const user = await User.getUserById(user_id);
        if (!user) {
            res.status(404).json({
                message: `User with id ${user_id} not found`,
            });
            return;
        }

        const comment = await Comment.getCommentById(comment_id);
        if (!comment) {
            return res.status(404).json({
                message: "Comment not found"
            });
        }

        // check if personality_type is valid
        if (!comment.personality_types.includes(personality_type)) {
            return res.status(400).json({
                message: 'Personality type not valid for this comment'
            });
        }

        // check if personality_type_tag is valid for the given personality_type
        let validTags = [];
        if (personality_type === 'MBTI') {
            validTags = ['INFP', 'INFJ', 'ENFP', 'ENFJ', 'INTJ', 'INTP', 'ENTP', 'ENTJ', 'ISFP', 'ISFJ', 'ESFP', 'ESFJ', 'ISTP', 'ISTJ', 'ESTP', 'ESTJ'];
        } else if (personality_type === 'Enneagram') {
            validTags = ['lw2', '2w3', '3w2', '3w4', '4w3', '4wb', '5w4', '5w6', '6wWb', '6W7', '7wW6', '7w8', '8w7', '8w9', '9w8', 'wl'];
        } else if (personality_type === 'Zodiac') {
            validTags = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
        }

        if (!validTags.includes(personality_type_tag)) {
            return res.status(400).json({
                message: 'Invalid personality type tag'
            });
        }

        // Check if user has already voted for this comment and personality type
        const existingVote = await Vote.findOne({
            comment_id: comment._id,
            user_id: user._id,
            personality_type: personality_type
        });

        if (existingVote) {
            // User has already voted for this comment and personality type
            res.status(400).json({
                error: 'User has already voted for this personality type and comment'
            });
            return;
        }

        const count = await Vote.count({
            comment_id: comment._id,
            user_id: user._id
        });

        if (count >= 3) {
            return res.status(400).json({
                message: 'User has already voted three times for the given comment and personality type'
            });
        }

        // Create new vote
        const newVote = new Vote({
            comment_id: comment._id,
            user_id: user._id,
            personality_type: personality_type,
            personality_type_tag: personality_type_tag
        });
        await newVote.save();

        res.status(201).json({
            message: 'Vote added successfully'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'Server error'
        });
    }
};

module.exports = {
    vote
};