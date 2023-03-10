'use strict';

const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');

module.exports = function() {
    router.get('/:user_id', UserController.getUser);
    router.post('/', UserController.createUser);
    return router;
}