export const CHECK_PASSWORD_SCHEMA =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-])[A-Za-z\d!@#$%^&*()_+{}\[\]:;<>,.?~\\-]{8,20}$/;

export const CHECK_PHONE_SCHEMA = /^\d{11,12}$/;
export const CHECK_IMAGE_BUCKET =
  /^https:\/\/raw\.githubusercontent\.com\/elian-cheng\/online-store-elyte\/main\/src\/assets\/img\/.*/;

export enum TokenType {
  ACCESS = 'access',
  REFRESH = 'refresh',
  RESET_PASSWORD = 'reset-password',
  VERIFY_EMAIL = 'verify-email'
}

export enum Role {
  USER = 'user',
  ADMIN = 'admin'
}
