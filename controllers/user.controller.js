const User = require('../models/user.model');
const {
    getNextUserId
} = require('../utils/counter');

async function createUser(req, res) {

    const {
        name,
        description,
        mbti,
        enneagram,
        variant,
        tritype,
        socionics,
        sloan,
        psyche
    } = req.body;

    // Check for name length validation
    if (name.length < 3 || name.length > 50) {
        return res.status(400).json({
            message: "Name length should be between 3 and 50 characters"
        });
    }

    // Check for description length validation
    if (description.length < 10 || description.length > 500) {
        return res.status(400).json({
            message: "Description length should be between 10 and 500 characters"
        });
    }

    try {
        const _id = getNextUserId();
        const user = new User({
            user_id: _id,
            name,
            description,
            mbti,
            enneagram,
            variant,
            tritype,
            socionics,
            sloan,
            psyche,
            image: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200'
        });
        const result = await user.save();
        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            "error": "Server error"
        });
    }
}

async function getUser(req, res) {
    try {
        const user = await User.getUserById(req.params.user_id);
        if (!user) {
            res.status(404).json({
                message: `User with id ${req.params.user_id} not found`,
            });
            return;
        }
        res.render('profile_template', {
            profile: user,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            "error": "Server error"
        });
    }
}

module.exports = {
    getUser,
    createUser
};