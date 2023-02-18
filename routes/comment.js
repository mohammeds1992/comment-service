'use strict';

const express = require('express');
const router = express.Router();
const CommentController = require('../controllers/comment.controller');
const VoteController = require('../controllers/vote.controller');
const LikeController = require('../controllers/like.controller');

module.exports = function() {
    router.post('/', CommentController.createComment);
    router.get('/:comment_id', CommentController.getComment);
    router.delete('/:comment_id', CommentController.deleteComment);
    router.put('/:comment_id', CommentController.updateComment);
    router.get('/', CommentController.getComments);

    router.post('/:comment_id/vote', VoteController.vote);

    router.post('/:comment_id/likes', LikeController.likeComment);
    router.delete('/:comment_id/likes', LikeController.unlikeComment);
    router.get('/:comment_id/likes/count', LikeController.getLikeCount);

    return router;
}