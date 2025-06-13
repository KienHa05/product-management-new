// 1. Mock các module
jest.mock('../../../../models/account.model', () => ({
  findOne: jest.fn()
}));
jest.mock('../../../../models/role.model', () => ({
  findOne: jest.fn()
}));
jest.mock('../../../../config/system', () => ({
  prefixAdmin: '/admin'
}));

const Account = require('../../../../models/account.model');
const Role = require('../../../../models/role.model');
const systemConfig = require('../../../../config/system');
const { requireAuth } = require('../../../../middlewares/admin/auth.middleware');

describe('admin/auth.middleware.js - requireAuth', () => {
  let req, res, next;

  beforeEach(() => {
    req = { cookies: {} };
    res = { redirect: jest.fn(), locals: {} };
    next = jest.fn();

    // reset mock
    Account.findOne.mockReset();
    Role.findOne.mockReset();
  });

  it('không có token => redirect tới login', async () => {
    await requireAuth(req, res, next);

    expect(res.redirect).toHaveBeenCalledWith(`${systemConfig.prefixAdmin}/auth/login`);
    expect(next).not.toHaveBeenCalled();
  });

  it('có token nhưng user không tồn tại => redirect tới login', async () => {
    req.cookies.token = 'abc';

    // mock findOne(...).select(...) => null
    Account.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(null)
    });

    await requireAuth(req, res, next);

    expect(Account.findOne).toHaveBeenCalledWith({ token: 'abc' });
    expect(res.redirect).toHaveBeenCalledWith(`${systemConfig.prefixAdmin}/auth/login`);
    expect(next).not.toHaveBeenCalled();
  });

  it('có token và user tồn tại => load role, gán res.locals và gọi next', async () => {
    const fakeUser = { _id: 'u1', role_id: 'r1', name: 'User1' };
    const fakeRole = { _id: 'r1', name: 'Admin' };

    req.cookies.token = 'token123';

    // mock Account.findOne(...).select(...)
    // => select resolves to fakeUser
    Account.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(fakeUser)
    });

    Role.findOne.mockResolvedValue(fakeRole);

    await requireAuth(req, res, next);

    expect(Account.findOne).toHaveBeenCalledWith({ token: 'token123' });
    expect(Role.findOne).toHaveBeenCalledWith({ _id: 'r1' });

    expect(res.locals.user).toBe(fakeUser);
    expect(res.locals.role).toBe(fakeRole);

    expect(next).toHaveBeenCalled();
    expect(res.redirect).not.toHaveBeenCalled();
  });
});