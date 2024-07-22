import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import Order, { IOrder } from '../models/Order';

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
  paymentInfo: { stripeId: string; status: string },
  totalPrice: number,
  orderStatus: string,
  paidAt: Date
): Promise<IOrder> => {
  // Check if an order with the same stripeId already exists
  const existingOrder = await Order.findOne({
    'paymentInfo.stripeId': paymentInfo.stripeId
  }).exec();
  if (existingOrder) {
    return existingOrder; // Return the existing order
  }

  // Create a new order
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
 * @param {string} userId
 * @returns {Promise<IOrder[]>}
 */
const getOrders = async (userId: string): Promise<IOrder[]> => {
  const condition = { 'userData.id': userId };
  return await Order.find(condition).exec();
};

/**
 * Get orders for admin
 * @returns {Promise<IOrder[]>}
 */
const getOrdersAdmin = async (): Promise<IOrder[]> => {
  return await Order.find().exec();
};

/**
 * Get order by id
 * @param {string} id
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<IOrder, Key> | null>}
 */
const getOrderById = async <Key extends keyof IOrder>(
  id: string,
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
 * @param {string} orderId
 * @param {string} status
 * @returns {Promise<IOrder>}
 */
const updateOrderById = async (orderId: number, status: string): Promise<IOrder> => {
  const order = await Order.findByIdAndUpdate(
    orderId,
    {
      orderStatus: status
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
