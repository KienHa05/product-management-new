jest.mock('nodemailer');

const nodemailer = require('nodemailer');
const { sendMail } = require('../../../helpers/sendMail');

describe('sendMail helper', () => {
  let transporterMock;
  const OLD_ENV = process.env;
  const email = 'test@example.com';
  const subject = 'Tiêu đề';
  const html = '<p>Nội dung</p>';

  beforeEach(() => {
    // Thiết lập env giả
    process.env = {
      ...OLD_ENV,
      EMAIL_USER: 'user@gmail.com',
      EMAIL_PASSWORD: 'pass123'
    };

    // Mock transporter
    transporterMock = {
      sendMail: jest.fn()
    };
    nodemailer.createTransport.mockReturnValue(transporterMock);
    jest.spyOn(console, 'log').mockImplementation(() => { });
  });

  afterEach(() => {
    jest.resetAllMocks();
    process.env = OLD_ENV;
  });

  test('Tạo transporter với cấu hình đúng', () => {
    sendMail(email, subject, html);

    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      service: 'gmail',
      auth: {
        user: 'user@gmail.com',
        pass: 'pass123'
      }
    });
  });

  test('Gửi mail thành công thì console.log thông báo', () => {
    // Thiết lập callback success
    transporterMock.sendMail.mockImplementation((options, cb) => {
      cb(null, { response: '250 OK' });
    });

    sendMail(email, subject, html);

    expect(transporterMock.sendMail).toHaveBeenCalledWith({
      from: 'user@gmail.com',
      to: email,
      subject: subject,
      html: html
    }, expect.any(Function));

    expect(console.log).toHaveBeenCalledWith('Email sent: 250 OK');
  });

  test('Gửi mail lỗi thì console.log lỗi', () => {
    const fakeError = new Error('SMTP error');
    transporterMock.sendMail.mockImplementation((options, cb) => {
      cb(fakeError, null);
    });

    sendMail(email, subject, html);

    expect(transporterMock.sendMail).toHaveBeenCalledWith({
      from: 'user@gmail.com',
      to: email,
      subject: subject,
      html: html
    }, expect.any(Function));

    expect(console.log).toHaveBeenCalledWith(fakeError);
  });
});
