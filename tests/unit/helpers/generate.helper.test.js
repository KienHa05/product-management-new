const { generateRandomString, generateRandomNumber } = require('../../../helpers/generate');

describe('generateRandomString helper', () => {
  let length, result;

  beforeEach(() => {
    length = 0;
    result = '';
  });

  test('Thiếu độ dài (mặc định = 0) thì trả về chuỗi rỗng', () => {
    // Không truyền length, giả lập length = 0
    result = generateRandomString(0);
    expect(result).toBe('');
  });

  test('Trả về chuỗi đúng độ dài yêu cầu', () => {
    length = 12;
    result = generateRandomString(length);
    expect(typeof result).toBe('string');
    expect(result).toHaveLength(length);
  });

  test('Chỉ chứa ký tự chữ hoa, chữ thường và chữ số', () => {
    length = 30;
    result = generateRandomString(length);
    expect(/^[A-Za-z0-9]+$/.test(result)).toBe(true);
  });
});

describe('generateRandomNumber helper', () => {
  let length, result;

  beforeEach(() => {
    length = 0;
    result = '';
  });

  test('Thiếu độ dài (mặc định = 0) thì trả về chuỗi rỗng', () => {
    result = generateRandomNumber(0);
    expect(result).toBe('');
  });

  test('Trả về chuỗi số đúng độ dài yêu cầu', () => {
    length = 8;
    result = generateRandomNumber(length);
    expect(typeof result).toBe('string');
    expect(result).toHaveLength(length);
  });

  test('Chỉ chứa các ký tự 0–9', () => {
    length = 50;
    result = generateRandomNumber(length);
    expect(/^[0-9]+$/.test(result)).toBe(true);
  });
});
