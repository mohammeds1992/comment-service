const Vote = require('../models/vote.model');
const Comment = require('../models/comment.model');

async function vote(req, res) {
    try {
        const {
            comment_id,
            user_id,
            personality_type,
            personality_type_tag
        } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }

        const comment = await Comment.findById(comment_id);

        if (!comment) {
            return res.status(404).json({
                message: 'Comment not found'
            });
        }

        // check if personality_type is valid
        const validPersonalityTypes = ['MBTI', 'Enneagram', 'Zodiac'];
        if (!validPersonalityTypes.includes(personality_type)) {
            return res.status(400).json({
                message: 'Invalid personality type'
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


        if (!comment.personality_type.includes(personality_type)) {
            return res.status(400).json({
                message: 'Personality type not valid for this comment'
            });
        }

        // Check if user has already voted for this comment and personality type
        const existingVote = await Vote.findOne({
            comment_id,
            user_id,
            personality_type
        });

        if (existingVote) {
            // User has already voted for this comment and personality type
            res.status(400).json({
                error: 'User has already voted for this personality type and comment'
            });
            return;
        }

        const count = await Vote.count({
            comment_id,
            user_id
        });

        if (count >= 3) {
            return res.status(400).json({
                message: 'User has already voted three times for the given comment and personality type'
            });
        }

        // Create new vote
        const newVote = new Vote({
            comment_id,
            user_id,
            personality_type,
            personality_type_tag
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