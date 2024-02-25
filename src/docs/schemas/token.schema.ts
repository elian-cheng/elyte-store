const tokenSchema = {
  $type: {
    '@enum': ['ACCESS', 'REFRESH', 'RESET_PASSWORD']
  },
  $role: {
    '@enum': ['CORPORATE_ADMIN', 'COUNTRY_ADMIN', 'SELLER']
  },
  $country: {
    '@enum': ['USA', 'Mexico', 'Chile']
  },
  $expires: '2020-05-12T16:18:04.793Z',
  $token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInJvbGUiOiJTRUxMRVIiLCJpYXQiOjE3MDQ4ODEzMDMsImV4cCI6MTcwNDg4MzEwMywidHlwZSI6IkFDQ0VTUyJ9.sVDix3afwQHQ4aYlKC4mmmaaCLJ5qqlruLLBFhj24X0'
};

module.exports = tokenSchema;
