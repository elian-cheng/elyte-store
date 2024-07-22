import axios from 'axios';
import { IOrder, IOrderCreate, IOrderUpdate } from 'interfaces/OrderInterface';

export const getOrders = async () => {
  const { data } = await axios.get(`/orders`);
  return data;
};

export const getOrdersAdmin = async () => {
  const response = await axios.get(`/orders/admin`);
  const orders = response.data.map((order: IOrder) => {
    return {
      ...order,
      id: order._id.toString(),
    };
  });
  return orders;
};

export const getOrderById = async (id: string) => {
  const response = await axios.get<IOrder>(`/orders/${id}`);
  return response.data;
};

export const createOrder = async (body: IOrderCreate) => {
  const response = await axios.post<IOrder>('/orders', body);
  return response.data;
};

export const updateOrderStatus = async (id: string, body: IOrderUpdate) => {
  const response = await axios.patch<IOrder>(`/orders/${id}`, body);
  return response.data;
};

export const deleteOrder = async (id: string) => {
  const response = await axios.delete<IOrder>(`/orders/${id}`);
  return response.data;
};
