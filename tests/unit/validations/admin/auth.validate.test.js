const { loginPost } = require("../../../../validates/admin/auth.validate");

describe('loginPost validator', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      flash: jest.fn()
    };
    res = {
      redirect: jest.fn()
    };
    next = jest.fn();
  });

  test('Thiếu Email', () => {
    req.body = { password: 'abc123' };
    loginPost(req, res, next);

    expect(req.flash).toHaveBeenCalledWith('error', 'Vui Lòng Nhập Email!');
    expect(res.redirect).toHaveBeenCalledWith('back');
    expect(next).not.toHaveBeenCalled();
  });

  test('Thiếu Mật Khẩu', () => {
    req.body = { email: 'abc@example.com' };
    loginPost(req, res, next);

    expect(req.flash).toHaveBeenCalledWith('error', 'Vui Lòng Nhập Mật Khẩu!');
    expect(res.redirect).toHaveBeenCalledWith('back');
    expect(next).not.toHaveBeenCalled();
  });

  test('Đầy Đủ Email + Password', () => {
    req.body = { email: 'abc@example.com', password: 'abc123' };
    loginPost(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.flash).not.toHaveBeenCalled();
    expect(res.redirect).not.toHaveBeenCalled();
  });
});