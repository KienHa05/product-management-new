const { requirePermission } = require('../../../../middlewares/admin/permission.middleware');

describe('admin/permission.middleware.js - requirePermission', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      locals: {},
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    next = jest.fn();
  });

  it('không có role => trả về 403', () => {
    // res.locals.role undefined
    const mw = requirePermission('CREATE_USER');
    mw(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith('Bạn không có quyền truy cập chức năng này!');
    expect(next).not.toHaveBeenCalled();
  });

  it('có role nhưng không có permissions => trả về 403', () => {
    res.locals.role = {}; // no permissions field
    const mw = requirePermission('DELETE_USER');
    mw(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith('Bạn không có quyền truy cập chức năng này!');
    expect(next).not.toHaveBeenCalled();
  });

  it('có permissions nhưng không bao gồm requiredPermission => trả về 403', () => {
    res.locals.role = { permissions: ['READ_USER', 'UPDATE_USER'] };
    const mw = requirePermission('DELETE_USER');
    mw(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith('Bạn không có quyền truy cập chức năng này!');
    expect(next).not.toHaveBeenCalled();
  });

  it('permissions bao gồm requiredPermission => gọi next()', () => {
    res.locals.role = { permissions: ['READ_USER', 'DELETE_USER'] };
    const mw = requirePermission('DELETE_USER');
    mw(req, res, next);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
});
