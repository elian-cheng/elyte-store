import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';
import prisma from '../../src/client';
import { Country, Currency, Prisma, Role } from '@prisma/client';

const password = 'password1';
const salt = bcrypt.genSaltSync(10);

export const userOne = {
  name: faker.name.fullName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: Role.SELLER,
  country: Country.USA,
  currency: Currency.USD,
  mobilePhone: '68245456502',
  officePhone: '68245456502',
  jobTitle: 'Developer',
  pdfNotes:
    'For more details about the zones, measurements, numerology, identification and location of each product, you can consult the files sent together with the proposal.',
  pdfConditions:
    'Budget based on the amount requested by the client, not calculated by Ennat.\nValidity: 10 days.\n\nENNAT PROTECTIONS CORP\nEIN 32-0694112\nBank of America\nAccount N° 334062022512\nRouting N° 061000052',
  pdfFooter:
    'ENNAT PROTECTIONS CORP  /  1330 Compass Pointe Xing, Alpharetta, GA30005   /    www.ennatgroup.com'
};

export const userTwo = {
  name: faker.name.fullName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: Role.SELLER,
  country: Country.USA,
  currency: Currency.USD,
  mobilePhone: '68245456502',
  officePhone: '68245456502',
  jobTitle: 'Developer',
  pdfNotes:
    'For more details about the zones, measurements, numerology, identification and location of each product, you can consult the files sent together with the proposal.',
  pdfConditions:
    'Budget based on the amount requested by the client, not calculated by Ennat.\nValidity: 10 days.\n\nENNAT PROTECTIONS CORP\nEIN 32-0694112\nBank of America\nAccount N° 334062022512\nRouting N° 061000052',
  pdfFooter:
    'ENNAT PROTECTIONS CORP  /  1330 Compass Pointe Xing, Alpharetta, GA30005   /    www.ennatgroup.com'
};

export const admin = {
  name: faker.name.fullName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: Role.CORPORATE_ADMIN,
  country: Country.USA,
  currency: Currency.USD,
  mobilePhone: '68245456502',
  officePhone: '68245456502',
  jobTitle: 'Developer',
  pdfNotes:
    'For more details about the zones, measurements, numerology, identification and location of each product, you can consult the files sent together with the proposal.',
  pdfConditions:
    'Budget based on the amount requested by the client, not calculated by Ennat.\nValidity: 10 days.\n\nENNAT PROTECTIONS CORP\nEIN 32-0694112\nBank of America\nAccount N° 334062022512\nRouting N° 061000052',
  pdfFooter:
    'ENNAT PROTECTIONS CORP  /  1330 Compass Pointe Xing, Alpharetta, GA30005   /    www.ennatgroup.com'
};

export const insertUsers = async (users: Prisma.UserCreateManyInput[]) => {
  await prisma.user.createMany({
    data: users.map((user) => ({ ...user, password: bcrypt.hashSync(user.password, salt) }))
  });
};
