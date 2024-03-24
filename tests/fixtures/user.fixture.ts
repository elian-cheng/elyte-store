import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';
import { Role } from '../../src/utils/constants';
import User, { IUser } from '../../src/models/User';

const password = 'password1';
const salt = bcrypt.genSaltSync(10);

export const userOne = {
  name: faker.name.fullName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: Role.USER,
  phone: '68245456502'
};

export const userTwo = {
  name: faker.name.fullName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: Role.USER,
  phone: '68245456502'
};

export const admin = {
  name: faker.name.fullName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: Role.ADMIN,
  phone: '68245456502'
};

export const insertUsers = async (users: any[]) => {
  const hashedUsers = users.map((user) => ({
    ...user,
    password: bcrypt.hashSync(user.password, salt)
  }));

  await User.insertMany(hashedUsers);
};
