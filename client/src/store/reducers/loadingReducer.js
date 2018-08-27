import * as actionTypes from '../actions/actionTypes';

const initialState = {
  loggingIn: false,
  logginError: '',
  loginSucess: false,
  requestingAccess: false,
  requestAccessSuccess: false,
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN_START:
    return {
      ...state,
      loggingIn: true,
    };
    case actionTypes.LOGIN_FAIL:
    return {
      ...state,
      loggingIn: false,
      loginError: action.error,
    };
    default: return;
  }
}

export default reducer;