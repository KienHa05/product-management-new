const paginate = require('../../../helpers/pagination');

describe('pagination.js', () => {
  test('Tính trang khi có query.page', () => {
    const objectPagination = {
      currentPage: 1,
      limitItems: 5,
      totalPage: 0,
      skip: 0
    };

    const query = { page: '3' };
    const countProducts = 23; // Tổng số item

    const result = paginate({ ...objectPagination }, query, countProducts);

    expect(result.currentPage).toBe(3);
    expect(result.skip).toBe(10); // (3 - 1) * 5
    expect(result.totalPage).toBe(Math.ceil(countProducts / 5));
  });

  test('Mặc định trang là 1 nếu không có query.page', () => {
    const objectPagination = {
      currentPage: 1,
      limitItems: 10,
      totalPage: 0,
      skip: 0
    };

    const query = {}; // không có page
    const countProducts = 50;

    const result = paginate({ ...objectPagination }, query, countProducts);

    expect(result.currentPage).toBe(1);
    expect(result.skip).toBe(0); // (1 - 1) * 10
    expect(result.totalPage).toBe(5);
  });

  test('Số trang tổng là 0 nếu không có sản phẩm', () => {
    const objectPagination = {
      currentPage: 1,
      limitItems: 10,
      totalPage: 0,
      skip: 0
    };

    const query = { page: '1' };
    const countProducts = 0;

    const result = paginate({ ...objectPagination }, query, countProducts);

    expect(result.totalPage).toBe(0);
  });
});
