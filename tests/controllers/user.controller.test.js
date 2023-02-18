const User = require('../../models/user.model');
const {
    createUser,
    getUser
} = require('../../controllers/user.controller');
const mockConsole = require('jest-mock-console');
jest.mock('../../models/user.model');

describe('User Controller', () => {

    let restoreConsole;

    beforeAll(() => {
        restoreConsole = mockConsole();
    });

    afterAll(() => {
        restoreConsole();
    });

    describe('createUser', () => {
        const req = {
            body: {
                name: 'John Doe',
                description: 'Lorem ipsum dolor sit amet',
                mbti: 'INFP',
                enneagram: '4w5',
                variant: 'self-preserving',
                tritype: '459',
                socionics: 'IEI',
                sloan: 'RLOEI',
                psyche: 'Phlegmatic'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        test('should return status code 201 with created user', async () => {
            const result = {
                user_id: 1,
                name: 'John Doe',
                description: 'Lorem ipsum dolor sit amet',
                mbti: 'INFP',
                enneagram: '4w5',
                variant: 'self-preserving',
                tritype: '459',
                socionics: 'IEI',
                sloan: 'RLOEI',
                psyche: 'Phlegmatic',
                image: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200'
            };
            User.prototype.save = jest.fn().mockResolvedValue(result);
            await createUser(req, res);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(result);
        });

        test('should return status code 400 with error message for invalid name length', async () => {
            req.body.name = 'a';
            await createUser(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            console.log(res.json)
            expect(res.json).toHaveBeenCalledWith({
                message: 'Name length should be between 3 and 50 characters'
            });
            req.body.name = 'John Doe';
        });

        test('should return status code 400 with error message for invalid description length', async () => {
            req.body.description = 'a';
            await createUser(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Description length should be between 10 and 500 characters'
            });
            req.body.description = 'Lorem ipsum dolor sit amet';
        });

        test('should return status code 500 for server error', async () => {
            User.prototype.save = jest.fn().mockRejectedValue(new Error('Database error'));
            await createUser(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Server error'
            });
        });
    });

    describe('getUser', () => {
        test('returns the user profile', async () => {
            const user = {
                user_id: '1',
                name: 'John Doe',
                description: 'A software engineer',
                mbti: 'ISTJ',
                enneagram: 'Type 6',
                variant: 'SP',
                tritype: '136',
                socionics: 'LII',
                sloan: 'SC',
                psyche: 'Analyst',
                image: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200'
            };
            User.getUserById.mockResolvedValue(user);

            const req = {
                params: {
                    user_id: '1'
                }
            };
            const res = {
                render: jest.fn()
            };

            await getUser(req, res);

            expect(User.getUserById).toHaveBeenCalledWith('1');
            expect(res.render).toHaveBeenCalledWith('profile_template', {
                profile: user
            });
        });

        test('returns a 404 error when the user is not found', async () => {
            User.getUserById.mockResolvedValue(null);

            const req = {
                params: {
                    user_id: '1'
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await getUser(req, res);

            expect(User.getUserById).toHaveBeenCalledWith('1');
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: 'User with id 1 not found'
            });
        });

        test('returns a 500 error when there is a server error', async () => {
            const error = new Error('Something went wrong');
            User.getUserById.mockRejectedValue(error);

            const req = {
                params: {
                    user_id: '1'
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await getUser(req, res);

            expect(User.getUserById).toHaveBeenCalledWith('1');
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Server error'
            });
        });
    });
});