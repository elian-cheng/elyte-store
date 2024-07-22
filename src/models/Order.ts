import { Schema, model, Document, Types } from 'mongoose';

interface IOrderItem {
  id: Types.ObjectId;
  title: string;
  image: string;
  price: number;
  quantity: number;
}

export interface IOrder extends Document {
  _id: Types.ObjectId;
  userData: {
    id: Types.ObjectId;
    name: string;
    email: string;
    phone: string;
    shippingInfo: {
      address: string;
      city: string;
      country: string;
      state: string;
      zip: string;
    };
  };
  orderItems: IOrderItem[];
  paymentInfo: {
    stripeId: string;
    status: string;
  };
  totalPrice: number;
  orderStatus: string;
  paidAt: Date;
  deliveredAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
const orderSchema = new Schema<IOrder>(
  {
    userData: {
      id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      shippingInfo: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        country: { type: String, required: true },
        state: { type: String },
        zip: { type: String, required: true }
      }
    },
    orderItems: [
      {
        id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        title: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true }
      }
    ],
    paymentInfo: {
      stripeId: { type: String, required: true },
      status: { type: String, required: true }
    },
    totalPrice: { type: Number, required: true },
    orderStatus: { type: String, required: true, default: 'Processing' },
    paidAt: { type: Date, required: true },
    deliveredAt: { type: Date }
  },
  { collection: 'orders', timestamps: true }
);

export default model<IOrder>('Order', orderSchema);
