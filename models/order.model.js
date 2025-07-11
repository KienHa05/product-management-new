const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user_id: String,
    cart_id: String,
    userInfo: {
      fullName: String,
      phone: String,
      address: String,
      email: String
    },
    products: [
      {
        product_id: String,
        price: Number,
        discountPercentage: Number,
        quantity: Number,
      }
    ],
    paymentMethod: {
      type: String,
      enum: ['COD', 'Momo', 'VNPay', 'ZaloPay', 'BankTransfer'],
      default: 'COD'
    },
    shippingProvider: {
      code: {
        type: String,
        enum: ['GHN', 'VTP', 'GHTK', 'JNT', 'NJV', 'SPX'],
        default: "GHN"
      },
    },
    note: String,
    status: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'packing',
        'shipping',
        'delivered',
        'cancelled'
      ],
      default: 'pending',
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date
  },
  {
    timestamps: true,
  }
);
const Order = mongoose.model('Order', orderSchema, "orders");

module.exports = Order;