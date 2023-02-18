const User = require('../../models/user.model');
const Comment = require('../../models/comment.model');

const {
    createComment,
    updateComment,
    deleteComment,
    getComment,
    getComments
} = require('../../controllers/comment.controller');

const mockConsole = require('jest-mock-console');
jest.mock('../../models/user.model');
jest.mock('../../models/comment.model');


describe('commentController', () => {

    let restoreConsole;

    beforeAll(() => {
        restoreConsole = mockConsole();
    });

    afterAll(() => {
        restoreConsole();
    });

    describe('createComment', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });

        test('should return status code 400 if title and/or description is missing', async () => {
            const req = {
                body: {
                    personality_types: ['MBTI'],
                    user_id: 1,
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            await createComment(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "Title and description are mandatory"
            });
        });

        test('should return status code 400 if title is too long', async () => {
            const req = {
                body: {
                    title: 'a'.repeat(101),
                    description: 'Test description',
                    personality_types: ['MBTI'],
                    user_id: 1,
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            await createComment(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "Title should be less than 100 characters"
            });
        });

        test('should return status code 400 if description is too long', async () => {
            const req = {
                body: {
                    title: 'Test title',
                    description: 'a'.repeat(1001),
                    personality_types: ['MBTI'],
                    user_id: 1,
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            await createComment(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "Description should be less than 1000 characters"
            });
        });

        test('should return status code 400 if personality_types is not an array or contains invalid values', async () => {
            const req = {
                body: {
                    title: 'Test title',
                    description: 'Test description',
                    personality_types: ['invalid_type'],
                    user_id: 1,
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            await createComment(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "Invalid personality types"
            });
        });
        test('should return status code 400 if personality types are not an array', async () => {
            const req = {
                body: {
                    title: 'This is a title',
                    description: 'This is a description',
                    personality_types: 'MBTI',
                    user_id: 1
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            await createComment(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "Invalid personality types"
            });
        });

        test('should return status code 404 if user is not found', async () => {
            const req = {
                body: {
                    title: 'Test Comment',
                    description: 'This is a test comment',
                    personality_types: ['MBTI'],
                    user_id: 1
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            await createComment(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
        });

        test('should create a comment and return status code 201', async () => {
            const user = {
                _id: 1,
                name: 'John Doe'
            };

            jest.spyOn(User, 'getUserById').mockResolvedValue(user);

            const commentData = {
                title: 'Test Comment',
                description: 'This is a test comment',
                personality_types: ['MBTI', 'Enneagram'],
                user_id: 1
            };

            const expectedComment = {
                comment_id: expect.any(String),
                title: commentData.title,
                description: commentData.description,
                personality_types: commentData.personality_types,
                created_by: user,
                created_at: expect.any(Date),
                last_modified_at: expect.any(Date)
            };

            const req = {
                body: commentData
            };

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            Comment.prototype.save = jest.fn().mockResolvedValue(expectedComment);

            await createComment(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expectedComment);
        });
    });

    describe('updateComment', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });

        test('should update a comment with valid title and description', async () => {
            const comment = {
                comment_id: 1,
                title: 'Test Comment',
                description: 'This is a test comment',
                created_by: {
                    _id: 1,
                    name: 'John Doe'
                },
                created_at: Date.now(),
                last_modified_at: Date.now()
            };

            const getCommentByIdMock = jest.fn().mockResolvedValue(comment);
            Comment.getCommentById = getCommentByIdMock;

            const saveCommentMock = jest.fn().mockResolvedValue(comment);
            comment.save = saveCommentMock;

            const req = {
                body: {
                    title: 'Updated Comment',
                    description: 'This is an updated test comment'
                },
                params: {
                    comment_id: 1
                }
            };

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await updateComment(req, res);

            expect(getCommentByIdMock).toHaveBeenCalledWith(1);
            expect(saveCommentMock).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(comment);
        });

        test('should return 400 if title and description are not provided', async () => {
            const comment = {
                comment_id: 1,
                title: 'Test Comment',
                description: 'This is a test comment',
                created_by: {
                    _id: 1,
                    name: 'John Doe'
                },
                created_at: Date.now(),
                last_modified_at: Date.now()
            };
            jest.spyOn(Comment, 'getCommentById').mockResolvedValue(comment);

            const req = {
                body: {
                    title: '',
                    description: ''
                },
                params: {
                    comment_id: 1
                }
            };

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await updateComment(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Title and description are mandatory'
            });
        });

        test('should return 404 if comment is not found', async () => {
            jest.spyOn(Comment, 'getCommentById').mockResolvedValue(null);

            const req = {
                body: {
                    title: 'Updated Comment',
                    description: 'This is an updated test comment'
                },
                params: {
                    comment_id: 1
                }
            };

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await updateComment(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: `Comment with id ${req.params.comment_id} not found`
            });
        });


        test('should return 400 if title is too long', async () => {

            const comment = {
                comment_id: 1,
                title: 'Test Comment',
                description: 'This is a test comment',
                created_by: {
                    _id: 1,
                    name: 'John Doe'
                },
                created_at: Date.now(),
                last_modified_at: Date.now()
            };
            jest.spyOn(Comment, 'getCommentById').mockResolvedValue(comment);

            const req = {
                body: {
                    title: 'a'.repeat(101),
                    description: 'This is an updated test comment',
                },
                params: {
                    comment_id: 1
                }
            };

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await updateComment(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Title should be less than 100 characters',
            });
        });


        test('should return 400 if description is too long', async () => {

            const comment = {
                comment_id: 1,
                title: 'Test Comment',
                description: 'This is a test comment',
                created_by: {
                    _id: 1,
                    name: 'John Doe'
                },
                created_at: Date.now(),
                last_modified_at: Date.now()
            };
            jest.spyOn(Comment, 'getCommentById').mockResolvedValue(comment);

            const req = {
                body: {
                    title: 'Updated Comment',
                    description: 'a'.repeat(1001),
                },
                params: {
                    comment_id: 1
                }
            };

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            await updateComment(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Description should be less than 1000 characters',
            });
        });


    });

    describe('deleteComment', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });
        test('should delete a comment with valid comment id', async () => {
            const comment = {
                comment_id: 1,
                title: 'Test Comment',
                description: 'This is a test comment',
                created_by: {
                    _id: 1,
                    name: 'John Doe'
                },
                created_at: Date.now(),
                last_modified_at: Date.now(),
                remove: jest.fn()
            };
            jest.spyOn(Comment, 'getCommentById').mockResolvedValue(comment);

            const req = {
                params: {
                    comment_id: 1
                }
            };

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await deleteComment(req, res);

            expect(Comment.getCommentById).toHaveBeenCalledWith(1);
            expect(comment.remove).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Comment deleted"
            });
        });

        test('should return a 404 error if comment does not exist', async () => {
            jest.spyOn(Comment, 'getCommentById').mockResolvedValue(null);

            const req = {
                params: {
                    comment_id: 1
                }
            };

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await deleteComment(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Comment with id 1 not found'
            });
        });

        test('should return a 500 error if there is a server error', async () => {
            jest.spyOn(Comment, 'getCommentById').mockRejectedValue(new Error('Database error'));

            const req = {
                params: {
                    comment_id: 1
                }
            };

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await deleteComment(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Server error'
            });
        });

    });

    describe('getComments', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });

        test('should return a comment if it exists', async () => {
            const comment = {
                comment_id: 1,
                title: 'Test Comment',
                description: 'This is a test comment',
                created_by: {
                    _id: 1,
                    name: 'John Doe'
                },
                created_at: Date.now(),
                last_modified_at: Date.now()
            };
            jest.spyOn(Comment, 'getCommentById').mockResolvedValue(comment);

            const req = {
                params: {
                    comment_id: 1
                }
            };

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await getComment(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(comment);
        });

        test('should return a 404 status if the comment does not exist', async () => {
            jest.spyOn(Comment, 'getCommentById').mockResolvedValue(null);

            const req = {
                params: {
                    comment_id: 1
                }
            };

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await getComment(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: `Comment with id ${req.params.comment_id} not found`
            });
        });

        test('should return a 500 status if there is a server error', async () => {
            const error = new Error('Server error');
            jest.spyOn(Comment, 'getCommentById').mockRejectedValue(error);

            const req = {
                params: {
                    comment_id: 1
                }
            };

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await getComment(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Server error'
            });
        });
    });
});