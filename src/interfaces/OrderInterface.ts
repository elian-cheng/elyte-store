import { IUserData } from './UserInterface';

export interface IOrderItem {
  id: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
}

export interface IOrderUpdate {
  status: string;
}

export interface IOrderShort {
  id: string;
  userData: IUserData;
  orderItems: IOrderItem[];
  totalPrice: number;
  orderStatus: string;
  paidAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderCreate {
  userData: {
    id: string;
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
  totalPrice: string | number;
  orderStatus: string;
  paidAt: Date;
}

export interface IOrder extends IOrderCreate {
  _id: string;
  deliveredAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
