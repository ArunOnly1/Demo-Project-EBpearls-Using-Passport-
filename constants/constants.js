const responseMessages = {
  UNKNOWN_ERROR: 'Unknown error.',
  SUCCESS: 'Success',
  FAILED: 'Failed',
  VERIFY_USER: 'Verify User',
  INVALID_DATA: 'Invalid data',
  ALREADY_VERIFIED_USER: 'Already Verified',
  LOGOUT: 'Logout',
  REFRESH_TOKEN: 'Refresh Token',
  RESET_PASSWORD: 'Reset Password',
  EIT: 'Expired/Invalid Token',
  ET: 'Expired Token',
  FAILED_REFRESH_TOKEN: 'Could refresh Token.Please try again later.',
  LOGOUT_MESSAGE_SUCCESS: 'Logged out successfully',
  TOKEN_REFRESH_SUCCESS_MESSAGE: 'Tokens refreshed successfully',
  CREDIENTIAL_FAILED: 'Email/Password is invalid. Please try again.',
  SOMETHING_WENT_WRONG_WITH_DB_CONNECTION:
    'Something went wrong with db connection. Please try again later.',
  BAD_REQUEST:
    'Something went wrong with requested url. Please try again later.',
  LOGIN_SUCCESS: 'Logged in successfully',
  EMAIL_ALREADY_TAKEN: 'Email is already in use.',
  EMAIL_NOT_TAKEN: 'Email is not in use.',
  VALIDATION_ERROR: 'Validation Errors.',
  VALIDATION_SUCCESS: 'Validation Success.',
  VALIDATION_FAILURE: 'Validation failed.',
  NOT_ALLOWED: 'Not allowed to update this data',
}

module.exports = responseMessages
