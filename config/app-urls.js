const getMtSsoUrl = () => {
  let envName = process.env.NODE_ENV;

  if (envName === 'production') {
    return process.env.MT_SSO_URL_PROD;
  }

  if (envName === 'staging') {
    return process.env.MT_SSO_URL_STAGING;
  }

  if (envName === 'test') {
    return process.env.MT_SSO_URL_TEST;
  }
  return process.env.MT_SSO_URL_DEV;
};

module.exports.getMtSsoUrl = getMtSsoUrl;
