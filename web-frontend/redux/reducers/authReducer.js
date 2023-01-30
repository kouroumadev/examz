import {SET_CURRENT_USER, USER_LOADING, RESET_CURRENT_USER} from "./types";
const isEmpty = require("is-empty");
const initialState = {
  isAuthenticated: false,
  user: {},
  loading: false
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      };
    case RESET_CURRENT_USER:
      return {
        isAuthenticated: false,
        user: {},
        loading: false
      }
    case USER_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
}