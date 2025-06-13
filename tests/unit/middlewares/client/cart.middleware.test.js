// Mock module Cart
jest.mock('../../../../models/cart.model', () => {
  const saveMock = jest.fn().mockResolvedValue();
  const Cart = jest.fn().mockImplementation(() => ({
    id: 'newCartId',
    save: saveMock
  }));

  Cart.findOne = jest.fn();
  return Cart;
});

const Cart = require('../../../../models/cart.model');
const { cartId } = require('../../../../middlewares/client/cart.middleware');

describe('Middleware quản lý giỏ hàng (cartId)', () => {
  let req, res, next;
  const COOKIE_EXPIRES = 365 * 24 * 60 * 60 * 1000;

  beforeEach(() => {
    req = { cookies: {} };
    res = {
      cookie: jest.fn(),
      redirect: jest.fn(),
      locals: {}
    };
    next = jest.fn();
    jest.clearAllMocks();
    // Giả lập thời gian cố định
    jest.spyOn(Date, 'now').mockReturnValue(1000000);
  });

  afterEach(() => {
    Date.now.mockRestore();
  });

  it('nếu không có cookie cartId thì tạo cart mới, set cookie và gọi next()', async () => {
    await cartId(req, res, next);

    // Kiểm tra Cart (factory) được gọi và save được gọi trên instance
    expect(Cart).toHaveBeenCalled();
    const instance = Cart.mock.results[0].value;
    expect(instance.save).toHaveBeenCalled();

    // Kiểm tra set cookie đúng giá trị và expires
    expect(res.cookie).toHaveBeenCalledWith(
      'cartId',
      'newCartId',
      expect.objectContaining({ expires: new Date(1000000 + COOKIE_EXPIRES) })
    );
    expect(next).toHaveBeenCalled();
  });

  it('nếu có cookie cartId nhưng không tìm thấy cart thì redirect về / và không gọi next()', async () => {
    req.cookies.cartId = 'invalidId';
    Cart.findOne.mockResolvedValue(null);

    await cartId(req, res, next);

    expect(Cart.findOne).toHaveBeenCalledWith({ _id: 'invalidId' });
    expect(res.redirect).toHaveBeenCalledWith('/');
    expect(next).not.toHaveBeenCalled();
  });

  it('nếu cartId hợp lệ thì tính totalQuantity, gán res.locals.miniCart và gọi next()', async () => {
    req.cookies.cartId = 'validId';
    const fakeCart = { products: [{ quantity: 2 }, { quantity: 3 }] };
    Cart.findOne.mockResolvedValue(fakeCart);

    await cartId(req, res, next);

    // Kiểm tra findOne được gọi đúng
    expect(Cart.findOne).toHaveBeenCalledWith({ _id: 'validId' });
    // Kiểm tra tính tổng quantity
    expect(fakeCart.totalQuantity).toBe(5);
    expect(res.locals.miniCart).toBe(fakeCart);
    expect(next).toHaveBeenCalled();
  });
});
