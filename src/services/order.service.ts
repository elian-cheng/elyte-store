import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import Order, { IOrder } from '../models/Order';
import { SortOrder } from 'mongoose';

/**
 * Create an order
 * @param {object} userData
 * @param {object} shippingInfo
 * @param {Array} orderItems
 * @param {object} paymentInfo
 * @param {number} totalPrice
 * @param {string} orderStatus
 * @param {Date} paidAt
 * @returns {Promise<IOrder>}
 */
const createOrder = async (
  userData: object,
  shippingInfo: object,
  orderItems: object[],
  paymentInfo: object,
  totalPrice: number,
  orderStatus: string,
  paidAt: Date
): Promise<IOrder> => {
  const order = new Order({
    userData,
    shippingInfo,
    orderItems,
    paymentInfo,
    totalPrice,
    orderStatus,
    paidAt
  });
  return await order.save();
};

/**
 * Get orders
 * @returns {Promise<IOrder[]>}
 */
const getOrders = async (
  _page: number = 1,
  _limit: number = 12,
  user?: string,
  _sort?: string,
  _order?: string
): Promise<{ data: IOrder[]; totalDocs: number }> => {
  let condition: any = {};

  if (user) {
    condition = { ...condition, 'userData.id': user };
  }

  let query = Order.find(condition);
  let totalOrdersQuery = Order.find(condition);

  if (_sort && _order) {
    query = query.sort({ [_sort]: _order as SortOrder });
  }

  const totalDocs = await totalOrdersQuery.countDocuments().exec();

  if (_page && _limit) {
    const pageSize = _limit;
    const page = _page;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  const docs = await query.exec();
  return {
    data: docs,
    totalDocs
  };
};

/**
 * Get orders for admin
 * @returns {Promise<IOrder[]>}
 */
const getOrdersAdmin = async (): Promise<IOrder[]> => {
  return await Order.find().populate('userData.id', 'name email').exec();
};

/**
 * Get order by id
 * @param {number} id
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<IOrder, Key> | null>}
 */
const getOrderById = async <Key extends keyof IOrder>(
  id: number,
  keys: Key[] = [
    '_id',
    'userData',
    'orderItems',
    'paymentInfo',
    'totalPrice',
    'orderStatus',
    'paidAt',
    'createdAt',
    'updatedAt'
  ] as Key[]
): Promise<Pick<IOrder, Key> | null> => {
  return Order.findById(id).select(keys.join(' ')).exec();
};

/**
 * Update order by id
 * @param {number} orderId
 * @param {object} updateData
 * @returns {Promise<IOrder>}
 */
const updateOrderById = async (
  orderId: number,
  userData?: object,
  orderItems?: object[],
  paymentInfo?: object,
  totalPrice?: number,
  orderStatus?: string,
  paidAt?: Date
): Promise<IOrder> => {
  const order = await Order.findByIdAndUpdate(
    orderId,
    {
      userData,
      orderItems,
      paymentInfo,
      totalPrice,
      orderStatus,
      paidAt
    },
    { new: true }
  );
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  return order;
};

/**
 * Delete order by id
 * @param {number} orderId
 * @returns {Promise<IOrder>}
 */
const deleteOrderById = async (orderId: number): Promise<IOrder> => {
  return (await Order.findOneAndDelete({ _id: orderId })) as IOrder;
};

export default {
  createOrder,
  getOrders,
  getOrdersAdmin,
  getOrderById,
  updateOrderById,
  deleteOrderById
};
