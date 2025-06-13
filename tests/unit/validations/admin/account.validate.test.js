const { createPost, editPatch } = require('../../../../validates/admin/account.validate');

describe('account.validate.js', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {}, flash: jest.fn() };
    res = { redirect: jest.fn() };
    next = jest.fn();
  });

  describe('createPost', () => {
    it('thiếu fullName', () => {
      req.body = { email: 'test@example.com', password: '123' };
      createPost(req, res, next);
      expect(req.flash).toHaveBeenCalledWith('error', 'Vui Lòng Nhập Họ Tên!');
      expect(res.redirect).toHaveBeenCalledWith('back');
    });

    it('thiếu email', () => {
      req.body = { fullName: 'Test', password: '123' };
      createPost(req, res, next);
      expect(req.flash).toHaveBeenCalledWith('error', 'Vui Lòng Nhập Email!');
      expect(res.redirect).toHaveBeenCalledWith('back');
    });

    it('thiếu password', () => {
      req.body = { fullName: 'Test', email: 'test@example.com' };
      createPost(req, res, next);
      expect(req.flash).toHaveBeenCalledWith('error', 'Vui Lòng Nhập Mật Khẩu!');
      expect(res.redirect).toHaveBeenCalledWith('back');
    });

    it('đầy đủ thông tin', () => {
      req.body = { fullName: 'Test', email: 'test@example.com', password: '123' };
      createPost(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('editPatch', () => {
    it('thiếu fullName', () => {
      req.body = { email: 'test@example.com' };
      editPatch(req, res, next);
      expect(req.flash).toHaveBeenCalledWith('error', 'Vui Lòng Nhập Họ Tên!');
      expect(res.redirect).toHaveBeenCalledWith('back');
    });

    it('thiếu email', () => {
      req.body = { fullName: 'Test' };
      editPatch(req, res, next);
      expect(req.flash).toHaveBeenCalledWith('error', 'Vui Lòng Nhập Email!');
      expect(res.redirect).toHaveBeenCalledWith('back');
    });

    it('đầy đủ thông tin', () => {
      req.body = { fullName: 'Test', email: 'test@example.com' };
      editPatch(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });
});
