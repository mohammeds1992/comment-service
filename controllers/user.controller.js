const User = require('../models/user.model');
const {
    getNextUserId
} = require('../utils/counter');

async function createUser(req, res) {
    try {
        // create a new user with the generated ID and other properties
        const _id = getNextUserId();
        const user = new User({
            id: _id,
            name: req.body.name,
            description: req.body.description,
            mbti: req.body.mbti,
            enneagram: req.body.enneagram,
            variant: req.body.variant,
            tritype: req.body.tritype,
            socionics: req.body.socionics,
            sloan: req.body.sloan,
            psyche: req.body.psyche,
            image: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200'
        });
        const result = await user.save();
        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
}

async function getUser(req, res) {
    try {
        const user = await User.getUserById(req.params.id);
        if (!user) {
            res.render('error_template', {
                message: `User with id ${req.params.id} not found`,
            });
            return;
        }
        res.render('profile_template', {
            profile: user,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
}

module.exports = {
    getUser,
    createUser
};