import axios from 'axios';
import { IUser, IUserMutation } from 'interfaces/UserInterface';
import { Role } from 'utils/constants';

export const getAllUsers = async () => {
  const response = await axios.get<IUser[]>('/users');
  const usersData = response.data.map((user) => {
    return {
      ...user,
      id: user._id.toString(),
    };
  });
  return usersData;
};

export const deleteUser = async (id: string) => {
  return await axios.delete(`/users/${id}`);
};

export const banUser = async (id: string) => {
  return await axios.patch(`/users/ban/${id}`);
};

export const updateRole = async (id: string, role: Role) => {
  return await axios.patch(`/users/role/${id}`, { role });
};

export const getUserProfile = async (id: string) => {
  const response = await axios.get<IUser>(`/users/${id}`);
  return response.data;
};

export const createUserProfile = async (body: IUserMutation) => {
  const response = await axios.post<IUser>('/users', body);
  return response.data;
};

export const updateUserProfile = async (id: string, body: IUserMutation) => {
  const response = await axios.patch<IUser>(`/users/${id}`, body);
  return response.data;
};
