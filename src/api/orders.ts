import axios from 'axios';
import { IOrder, IOrderCreate, IOrderUpdate } from 'interfaces/OrderInterface';

export const getOrders = async (
  filter: Record<string, string[]>,
  sort: Record<string, string>,
  pagination: Record<string, number>,
  search: string
) => {
  // filter = {"status":["completed","pending"]}
  // sort = {_sort:"createdAt",_order="desc"}
  // pagination = {_page:1,_limit=10}

  let queryString = '';
  for (const key in filter) {
    const filterValues = filter[key];
    if (filterValues.length) {
      queryString += `${key}=${filterValues}&`;
    }
  }
  for (const key in sort) {
    queryString += `${key}=${sort[key]}&`;
  }
  for (const key in pagination) {
    queryString += `${key}=${pagination[key]}&`;
  }
  if (search) {
    queryString += `search=${search}`;
  }

  const response = await axios.get(`/orders?${queryString}`);

  return {
    data: {
      orders: response.data.data,
      totalItems: +response.data.totalDocs,
    },
  };
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

export const updateOrder = async (id: string, body: IOrderUpdate) => {
  const response = await axios.patch<IOrder>(`/orders/${id}`, body);
  return response.data;
};

export const deleteOrder = async (id: string) => {
  const response = await axios.delete<IOrder>(`/orders/${id}`);
  return response.data;
};

export const deactivateOrder = async (id: string) => {
  return await axios.patch<IOrder>(`/orders/deactivate/${id}`);
};
