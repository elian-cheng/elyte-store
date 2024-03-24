interface INavigation {
  name: string;
  url: string;
}

export const MANAGER_NAV: INavigation[] = [
  {
    name: 'Users',
    url: '/users',
  },
];

export const MANAGER_NAV_MOBILE: INavigation[] = [
  {
    name: 'Users',
    url: '/users',
  },
  {
    name: 'Products',
    url: '/products',
  },
  {
    name: 'Create product',
    url: '/products/create',
  },
  {
    name: 'Shop',
    url: '/',
  },
  {
    name: 'Catalog',
    url: '/catalog',
  },
];

export const USER_NAV: INavigation[] = [
  {
    name: 'Main',
    url: '/',
  },
  {
    name: 'Catalog',
    url: '/catalog',
  },
];
