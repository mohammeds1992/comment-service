const mongoose = require('mongoose');

const MBTI_PERSONALITY_TYPES = [
    'INFP', 'INFJ', 'ENFP', 'ENFJ', 'INTJ', 'INTP', 'ENTP',
    'ENTJ', 'ISFP', 'ISFJ', 'ESFP', 'ESFJ', 'ISTP', 'ISTJ',
    'ESTP', 'ESTJ'
];

const ENNEAGRAM_PERSONALITY_TYPES = [
    'lw2', '2w3', '3w2', '3w4', '4w3', '4wb', '5w4', '5w6',
    '6wWb', '6W7', '7wW6', '7w8', '8w7', '8w9', '9w8', 'wl'
];

const ZODIAC_PERSONALITY_TYPES = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo',
    'Virgo', 'Libra', 'Scorpio', 'Sagittarius',
    'Capricorn', 'Aquarius', 'Pisces'
];

const PERSONALITY_TYPES = [
    'MBTI', 'Enneagram', 'Zodiac'
];

const voteSchema = new mongoose.Schema({
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
    personality_type: {
        type: String,
        enum: PERSONALITY_TYPES,
        required: true,
    },
    personality_type_tag: {
        type: String,
        required: true,
        validate: {
            validator: function(tag) {
                switch (this.personality_type) {
                    case 'MBTI':
                        return MBTI_PERSONALITY_TYPES.includes(tag);
                    case 'Enneagram':
                        return ENNEAGRAM_PERSONALITY_TYPES.includes(tag);
                    case 'Zodiac':
                        return ZODIAC_PERSONALITY_TYPES.includes(tag);
                    default:
                        return false;
                }
            },
            message: props => `${props.value} is not a valid personality type tag for ${this.personality_type}`
        }
    },
    voted_at: {
        type: Date,
        default: Date.now,
    },
});

const Vote = mongoose.model('Vote', voteSchema);

module.exports = Vote;