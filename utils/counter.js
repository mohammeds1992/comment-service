let userIdCounter = 1;
let commentIdCounter = 1;

function getNextUserId() {
    return userIdCounter++;
}

function getNextCommentId() {
    return commentIdCounter++;
}

module.exports = {
    getNextUserId, getNextCommentId
};