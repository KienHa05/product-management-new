const { tree } = require('../../../helpers/createTree');

describe('createTree.js - tree()', () => {
  test('Tạo cây từ mảng danh sách có quan hệ cha-con', () => {
    const data = [
      { id: '1', parent_id: '' },
      { id: '2', parent_id: '1' },
      { id: '3', parent_id: '1' },
      { id: '4', parent_id: '2' }
    ];

    const result = tree(data);

    expect(result).toHaveLength(1); // 1 node gốc

    expect(result[0]).toEqual(expect.objectContaining({
      id: '1',
      index: expect.any(Number),
      children: expect.any(Array)
    }));

    const children = result[0].children;

    expect(children).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: '2',
          index: expect.any(Number),
          children: [
            expect.objectContaining({
              id: '4',
              index: expect.any(Number)
            })
          ]
        }),
        expect.objectContaining({
          id: '3',
          index: expect.any(Number)
        })
      ])
    );
  });

  test('Trả về mảng rỗng nếu không có phần tử nào khớp parentId gốc', () => {
    const data = [
      { id: '1', parent_id: 'abc' }
    ];

    const result = tree(data);
    expect(result).toEqual([]);
  });

  test('Reset biến count giữa các lần gọi tree()', () => {
    const data1 = [
      { id: '1', parent_id: '' },
      { id: '2', parent_id: '1' }
    ];
    const result1 = tree(data1);
    expect(result1[0].index).toBe(1);
    expect(result1[0].children[0].index).toBe(2);

    const data2 = [
      { id: 'a', parent_id: '' }
    ];
    const result2 = tree(data2);
    expect(result2[0].index).toBe(1); // đã reset count
  });
});
