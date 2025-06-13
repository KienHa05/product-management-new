// Mock module uploadToCloudinary 
jest.mock('../../../../helpers/uploadToCloudinary', () => jest.fn());

const uploadToCloudinary = require('../../../../helpers/uploadToCloudinary');
const { upload } = require('../../../../middlewares/admin/uploadCloud.middleware');

describe('uploadCloud.middleware.js - upload', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {}, file: undefined };
    res = {};
    next = jest.fn();
    uploadToCloudinary.mockReset();
  });

  it('không có req.file => gọi next mà không upload', async () => {
    await upload(req, res, next);
    expect(uploadToCloudinary).not.toHaveBeenCalled();
    expect(req.body).toEqual({});
    expect(next).toHaveBeenCalled();
  });

  it('có req.file => upload rồi gán link vào req.body', async () => {
    const fakeBuffer = Buffer.from('fake');
    const fakeLink = 'https://cloudinary.com/fake.jpg';
    uploadToCloudinary.mockResolvedValue(fakeLink);

    req.file = {
      buffer: fakeBuffer,
      fieldname: 'avatar'
    };

    await upload(req, res, next);

    expect(uploadToCloudinary).toHaveBeenCalledWith(fakeBuffer);
    expect(req.body.avatar).toBe(fakeLink);
    expect(next).toHaveBeenCalled();
  });
});