const userSchema = {
  $id: 1,
  $name: 'John Doe',
  $email: 'john.doe@example.com',
  $jobTitle: 'Software Engineer',
  $mobilePhone: '12345678901',
  officePhone: '12345678901',
  $role: {
    '@enum': ['CORPORATE_ADMIN', 'COUNTRY_ADMIN', 'SELLER']
  },
  $currency: {
    '@enum': ['USD', 'MXN', 'CLP']
  },
  $country: {
    '@enum': ['USA', 'Mexico', 'Chile']
  },
  pdfNotes: 'Test Notes',
  pdfConditions: 'Test Conditions',
  pdfFooter: 'Test Footer',
  $tokens: ['token1', 'token2'],
  $isBanned: false
};

module.exports = userSchema;
