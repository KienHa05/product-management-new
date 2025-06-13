// Mock module User model
jest.mock('../../../../models/user.model', () => ({
  findOne: jest.fn()
}));

const User = require('../../../../models/user.model');
const { infoUser } = require('../../../../middlewares/client/user.middleware');

describe('Middleware lấy thông tin người dùng (infoUser)', () => {
  let req, res, next;

  beforeEach(() => {
    req = { cookies: {} };
    res = { locals: {} };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('nếu không có cookie tokenUser thì chỉ gọi next()', async () => {
    await infoUser(req, res, next);

    expect(User.findOne).not.toHaveBeenCalled();
    expect(res.locals.user).toBeUndefined();
    expect(next).toHaveBeenCalled();
  });

  it('nếu có tokenUser nhưng không tìm thấy user thì chỉ gọi next()', async () => {
    req.cookies.tokenUser = 'invalidToken';
    const mockQuery = { select: jest.fn().mockResolvedValue(null) };
    User.findOne.mockReturnValue(mockQuery);

    await infoUser(req, res, next);

    expect(User.findOne).toHaveBeenCalledWith({
      tokenUser: 'invalidToken',
      deleted: false,
      status: 'active'
    });
    expect(mockQuery.select).toHaveBeenCalledWith('-password');
    expect(res.locals.user).toBeUndefined();
    expect(next).toHaveBeenCalled();
  });

  it('nếu tokenUser hợp lệ thì gán res.locals.user và gọi next()', async () => {
    req.cookies.tokenUser = 'validToken';
    const fakeUser = { _id: 'u2', name: 'User Test' };
    const mockQuery = { select: jest.fn().mockResolvedValue(fakeUser) };
    User.findOne.mockReturnValue(mockQuery);

    await infoUser(req, res, next);

    expect(User.findOne).toHaveBeenCalledWith({
      tokenUser: 'validToken',
      deleted: false,
      status: 'active'
    });
    expect(mockQuery.select).toHaveBeenCalledWith('-password');
    expect(res.locals.user).toBe(fakeUser);
    expect(next).toHaveBeenCalled();
  });
});
