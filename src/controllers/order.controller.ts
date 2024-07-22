import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import logger from '../config/logger';
import { orderService } from '../services';
import { IUser } from '../models/User';

const createOrder = catchAsync(async (req, res) => {
  const { userData, orderItems, shippingInfo, paymentInfo, totalPrice, orderStatus, paidAt } =
    req.body;
  const order = await orderService.createOrder(
    userData,
    shippingInfo,
    orderItems,
    paymentInfo,
    totalPrice,
    orderStatus,
    paidAt
  );
  res.status(httpStatus.CREATED).send(order);
  logger.info(`Order ${order.id} was created.`);
});

const getOrders = catchAsync(async (req, res) => {
  const user = req.user as IUser;
  const orders = await orderService.getOrders(user._id);
  res.status(httpStatus.OK).send(orders);
});

const getOrdersAdmin = catchAsync(async (req, res) => {
  const orders = await orderService.getOrdersAdmin();
  res.status(httpStatus.OK).send(orders);
});

const getOrder = catchAsync(async (req, res) => {
  const order = await orderService.getOrderById(req.params.orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  res.send(order);
  logger.info(`Order ${order.id} was fetched.`);
});

const updateOrder = catchAsync(async (req, res) => {
  const { status } = req.body;
  const order = await orderService.updateOrderById(req.params.orderId, status);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  res.send(order);
  logger.info(`Order ${order.id} was updated.`);
});

const deleteOrder = catchAsync(async (req, res) => {
  await orderService.deleteOrderById(req.params.orderId);
  res.status(httpStatus.NO_CONTENT).send({ message: 'Order deleted' });
  logger.info(`Order ${req.params.orderId} was deleted.`);
});

export default {
  createOrder,
  getOrders,
  getOrdersAdmin,
  getOrder,
  updateOrder,
  deleteOrder
};
