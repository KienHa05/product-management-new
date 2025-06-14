// Mock các module
jest.mock('../../../../models/account.model', () => ({
  findOne: jest.fn()
}));
jest.mock('bcrypt', () => ({
  compare: jest.fn()
}));
jest.mock('../../../../config/system', () => ({
  prefixAdmin: '/admin'
}));

const Account = require('../../../../models/account.model');
const bcrypt = require('bcrypt');
const systemConfig = require('../../../../config/system');
const authController = require('../../../../controllers/admin/auth.controller');

// Utility để tạo req, res giả
function createReqRes({ cookies = {}, body = {}, flash = jest.fn() } = {}) {
  const req = { cookies, body, flash };
  const res = {
    redirect: jest.fn(),
    render: jest.fn(),
    cookie: jest.fn(),
    clearCookie: jest.fn(),
  };
  return { req, res };
}

describe('admin/auth.controller.js', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login (GET)', () => {
    it('nếu đã có token => redirect tới dashboard', () => {
      const { req, res } = createReqRes({ cookies: { token: 'abc' } });
      authController.login(req, res);
      expect(res.redirect).toHaveBeenCalledWith(`${systemConfig.prefixAdmin}/dashboard`);
      expect(res.render).not.toHaveBeenCalled();
    });

    it('nếu không có token => render trang login', () => {
      const { req, res } = createReqRes({ cookies: {} });
      authController.login(req, res);
      expect(res.render).toHaveBeenCalledWith('admin/pages/auth/login', { pageTitle: 'Đăng Nhập' });
      expect(res.redirect).not.toHaveBeenCalled();
    });
  });

  describe('loginPost (POST)', () => {
    const email = 'user@test.com';
    const password = 'pass123';
    const mockUser = { email, password: 'hashed', status: 'active', token: 'tok-xyz' };

    it('nếu user không tồn tại => flash lỗi và redirect back', async () => {
      Account.findOne.mockResolvedValue(null);
      const { req, res } = createReqRes({ body: { email, password }, flash: jest.fn() });

      await authController.loginPost(req, res);

      expect(Account.findOne).toHaveBeenCalledWith({ email, deleted: false });
      expect(req.flash).toHaveBeenCalledWith('error', 'Email Không Tồn Tại!');
      expect(res.redirect).toHaveBeenCalledWith('back');
    });

    it('nếu mật khẩu sai => flash lỗi và redirect back', async () => {
      Account.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);
      const { req, res } = createReqRes({ body: { email, password }, flash: jest.fn() });

      await authController.loginPost(req, res);

      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
      expect(req.flash).toHaveBeenCalledWith('error', 'Mật Khẩu Không Chính Xác. Vui Lòng Kiểm Tra Lại!');
      expect(res.redirect).toHaveBeenCalledWith('back');
    });

    it('nếu tài khoản inactive => flash lỗi và redirect back', async () => {
      const inactive = { ...mockUser, status: 'inactive' };
      Account.findOne.mockResolvedValue(inactive);
      bcrypt.compare.mockResolvedValue(true);
      const { req, res } = createReqRes({ body: { email, password }, flash: jest.fn() });

      await authController.loginPost(req, res);

      expect(req.flash).toHaveBeenCalledWith('error', 'Tài Khoản Này Đang Bị Khóa!');
      expect(res.redirect).toHaveBeenCalledWith('back');
    });

    it('đăng nhập thành công => set cookie và redirect dashboard', async () => {
      Account.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      const { req, res } = createReqRes({ body: { email, password } });

      await authController.loginPost(req, res);

      expect(res.cookie).toHaveBeenCalledWith('token', mockUser.token);
      expect(res.redirect).toHaveBeenCalledWith(`${systemConfig.prefixAdmin}/dashboard`);
    });
  });

  describe('logout (GET)', () => {
    it('xóa cookie và redirect về login', () => {
      const { req, res } = createReqRes();
      authController.logout(req, res);
      expect(res.clearCookie).toHaveBeenCalledWith('token');
      expect(res.redirect).toHaveBeenCalledWith(`${systemConfig.prefixAdmin}/auth/login`);
    });
  });
});
