// Mock module User model
jest.mock('../../../../models/user.model', () => ({
  findOne: jest.fn()
}));

const User = require('../../../../models/user.model');
const { requireAuth } = require('../../../../middlewares/client/auth.middleware');

describe('Middleware xác thực người dùng (requireAuth)', () => {
  let req, res, next;

  beforeEach(() => {
    req = { cookies: {} };
    res = {
      redirect: jest.fn(),
      locals: {}
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('nếu không có cookie tokenUser thì redirect về /user/login', async () => {
    await requireAuth(req, res, next);

    expect(res.redirect).toHaveBeenCalledWith('/user/login');
    expect(next).not.toHaveBeenCalled();
  });

  it('nếu có tokenUser nhưng không tìm thấy user tương ứng thì redirect về /user/login', async () => {
    req.cookies.tokenUser = 'invalidToken';
    const mockQuery = { select: jest.fn().mockResolvedValue(null) };
    User.findOne.mockReturnValue(mockQuery);

    await requireAuth(req, res, next);

    expect(User.findOne).toHaveBeenCalledWith({ tokenUser: 'invalidToken' });
    expect(mockQuery.select).toHaveBeenCalledWith('-password');
    expect(res.redirect).toHaveBeenCalledWith('/user/login');
    expect(next).not.toHaveBeenCalled();
  });

  it('nếu tokenUser hợp lệ thì gán res.locals.user và gọi next()', async () => {
    req.cookies.tokenUser = 'validToken';
    const fakeUser = { _id: 'u1', name: 'Test User' };
    const mockQuery = { select: jest.fn().mockResolvedValue(fakeUser) };
    User.findOne.mockReturnValue(mockQuery);

    await requireAuth(req, res, next);

    expect(User.findOne).toHaveBeenCalledWith({ tokenUser: 'validToken' });
    expect(mockQuery.select).toHaveBeenCalledWith('-password');
    expect(res.locals.user).toBe(fakeUser);
    expect(next).toHaveBeenCalled();
    expect(res.redirect).not.toHaveBeenCalled();
  });
});
