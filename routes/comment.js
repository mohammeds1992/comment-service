'use strict';

const express = require('express');
const router = express.Router();
const CommentController = require('../controllers/comment.controller');
const VoteController = require('../controllers/vote.controller');
const LikeController = require('../controllers/like.controller');

module.exports = function() {
    router.post('/', CommentController.createComment);
    router.get('/:id', CommentController.getComment);
    router.delete('/:id', CommentController.deleteComment);
    router.put('/:id', CommentController.updateComment);

    router.post('/:id/vote', VoteController.vote);

    router.post('/:id/likes', LikeController.likeComment);
    router.delete('/:id/likes', LikeController.unlikeComment);
    router.get('/:id/likes/count', LikeController.getLikeCount);

    return router;
}