export const CHECK_PASSWORD_SCHEMA =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-])[A-Za-z\d!@#$%^&*()_+{}\[\]:;<>,.?~\\-]{8,20}$/;
export const CHECK_PHONE_SCHEMA = /^\d{11,12}$/;
export const CHECK_PRICE_SCHEMA = /^[1-9]\d{0,6}(\.\d{1,2})?$/;
export const CHECK_INTEGER_SCHEMA = /^(?!0\d*$)\d+$/;
export const CHECK_PERCENT_SCHEMA = /^[1-9]\d{0,3}(\.\d{1,2})?$/;
export const CHECK_RATING_SCHEMA = /^[1-9]\d{0,1}(\.\d{1,2})?$/;

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

export const CATEGORIES = [
  'ebook',
  'laptop',
  'monitor',
  'monoblock',
  'smartwatch',
  'smartphone',
  'tablet',
  'TV-box',
];

export const ITEMS_PER_PAGE = 12;
export const COLORS = [
  'red',
  'blue',
  'green',
  'yellow',
  'black',
  'white',
  'silver',
];

export const ROLES = [Role.USER, Role.ADMIN];

export const cacheKeys = {
  currentUser: () => ['user'],
  userProfile: (id: string) => ['user', id],
  users: () => ['allUsers'],
  components: () => ['components'],
  componentCodes: () => ['componentCodes'],
  componentsByCodes: () => ['componentsByCodes'],
  componentById: (componentId: string) => ['component', componentId],
  categories: () => ['categories'],
  prices: () => ['prices'],
  priceById: (priceId: string) => ['price', priceId],
  packages: () => ['packages'],
  packageById: (packageId: string) => ['package', packageId],
  products: () => ['products'],
  productById: (productId: string) => ['product', productId],
  productCategories: () => ['productCategories'],
} as const;
