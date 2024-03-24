import axios from 'axios';
import {
  IProduct,
  IProductCreate,
  IProductImagesUpdate,
  IProductUpdate,
} from 'interfaces/ProductInterface';

export const getProducts = async (
  filter: Record<string, string[]>,
  sort: Record<string, string>,
  pagination: Record<string, number>
) => {
  // filter = {"category":["smartphone","laptops"]}
  // sort = {_sort:"price",_order="desc"}
  // pagination = {_page:1,_limit=10}

  let queryString = '';
  for (const key in filter) {
    const categoryValues = filter[key];
    if (categoryValues.length) {
      queryString += `${key}=${categoryValues}&`;
    }
  }
  for (const key in sort) {
    queryString += `${key}=${sort[key]}&`;
  }
  for (const key in pagination) {
    queryString += `${key}=${pagination[key]}&`;
  }

  const response = await axios.get(`/products?${queryString}`);

  return {
    data: {
      products: response.data.data,
      totalItems: +response.data.totalDocs,
    },
  };
};

export const getProductsAdmin = async () => {
  const response = await axios.get(`/products/admin`);
  const products = response.data.map((product: IProduct) => {
    return {
      ...product,
      id: product._id.toString(),
    };
  });
  return products;
};

export const getProductById = async (id: string) => {
  const response = await axios.get<IProduct>(`/products/${id}`);
  return response.data;
};

export const createProduct = async (body: IProductCreate) => {
  const response = await axios.post<IProduct>('/products', body);
  return response.data;
};

export const updateProduct = async (id: string, body: IProductUpdate) => {
  const response = await axios.patch<IProduct>(`/products/${id}`, body);
  return response.data;
};

export const deleteProduct = async (id: string) => {
  const response = await axios.delete<IProduct>(`/products/${id}`);
  return response.data;
};

export const deactivateProduct = async (id: string) => {
  return await axios.patch<IProduct>(`/products/deactivate/${id}`);
};

export const updateProductImages = async (
  id: string,
  body: IProductImagesUpdate
) => {
  const response = await axios.patch<IProduct>(`/products/images/${id}`, body);
  return response.data;
};
