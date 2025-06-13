const {
  registerPost,
  loginPost,
  forgotPasswordPost,
  resetPasswordPost
} = require('../../../../validates/client/user.validate');

describe('client/user.validate.js', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {}, flash: jest.fn() };
    res = { redirect: jest.fn() };
    next = jest.fn();
  });

  describe('registerPost', () => {
    it('thiếu fullName', () => {
      req.body = { email: 'a@example.com', password: '123' };
      registerPost(req, res, next);
      expect(req.flash).toHaveBeenCalledWith('error', 'Vui Lòng Nhập Họ Tên!');
      expect(res.redirect).toHaveBeenCalledWith('back');
    });

    it('thiếu email', () => {
      req.body = { fullName: 'Test', password: '123' };
      registerPost(req, res, next);
      expect(req.flash).toHaveBeenCalledWith('error', 'Vui Lòng Nhập Email!');
      expect(res.redirect).toHaveBeenCalledWith('back');
    });

    it('thiếu password', () => {
      req.body = { fullName: 'Test', email: 'a@example.com' };
      registerPost(req, res, next);
      expect(req.flash).toHaveBeenCalledWith('error', 'Vui Lòng Nhập Mật Khẩu!');
      expect(res.redirect).toHaveBeenCalledWith('back');
    });

    it('đầy đủ thông tin', () => {
      req.body = { fullName: 'Test', email: 'a@example.com', password: '123' };
      registerPost(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('loginPost', () => {
    it('thiếu email', () => {
      req.body = { password: '123' };
      loginPost(req, res, next);
      expect(req.flash).toHaveBeenCalledWith('error', 'Vui Lòng Nhập Email!');
      expect(res.redirect).toHaveBeenCalledWith('back');
    });

    it('thiếu password', () => {
      req.body = { email: 'a@example.com' };
      loginPost(req, res, next);
      expect(req.flash).toHaveBeenCalledWith('error', 'Vui Lòng Nhập Mật Khẩu!');
      expect(res.redirect).toHaveBeenCalledWith('back');
    });

    it('đầy đủ thông tin', () => {
      req.body = { email: 'a@example.com', password: '123' };
      loginPost(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('forgotPasswordPost', () => {
    it('thiếu email', () => {
      forgotPasswordPost(req, res, next);
      expect(req.flash).toHaveBeenCalledWith('error', 'Vui Lòng Nhập Email!');
      expect(res.redirect).toHaveBeenCalledWith('back');
    });

    it('có email', () => {
      req.body = { email: 'a@example.com' };
      forgotPasswordPost(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('resetPasswordPost', () => {
    it('thiếu password', () => {
      req.body = { confirmPassword: '123' };
      resetPasswordPost(req, res, next);
      expect(req.flash).toHaveBeenCalledWith('error', 'Vui Lòng Nhập Mật Khẩu!');
      expect(res.redirect).toHaveBeenCalledWith('back');
    });

    it('thiếu confirmPassword', () => {
      req.body = { password: '123' };
      resetPasswordPost(req, res, next);
      expect(req.flash).toHaveBeenCalledWith('error', 'Vui Lòng Xác Nhận Lại Mật Khẩu!');
      expect(res.redirect).toHaveBeenCalledWith('back');
    });

    it('mật khẩu xác nhận không khớp', () => {
      req.body = { password: '123', confirmPassword: '456' };
      resetPasswordPost(req, res, next);
      expect(req.flash).toHaveBeenCalledWith('error', 'Mật Khẩu Xác Nhận Không Khớp. Vui Lòng Nhập Lại!');
      expect(res.redirect).toHaveBeenCalledWith('back');
    });

    it('mật khẩu và xác nhận khớp', () => {
      req.body = { password: '123', confirmPassword: '123' };
      resetPasswordPost(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });
});
