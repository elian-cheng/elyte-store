const userSchema = {
  $_id: 1,
  $name: 'John Doe',
  $email: 'john.doe@example.com',
  $phone: '12345678901',
  $role: {
    '@enum': ['ADMIN', 'USER', 'SELLER']
  },
  $tokens: ['token1', 'token2'],
  $isBanned: false
};

module.exports = userSchema;
