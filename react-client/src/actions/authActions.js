/*---------------------------------------------------------------------------------------------
 *  Copyright (c) John Duckmanton. Portions Copyright (c) 2018 Brad Traversey. 
 *  All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';
import { GET_ERRORS, SET_CURRENT_USER } from './types';

// Get API URL from Config
const restApiUrl = require('../config/env').restApiUrl;

/*
 * Register User
 */
export const registerUser = (userData, history) => dispatch => {
  // Call the register api
  axios
    .post(`${restApiUrl}/api/users/register`, userData)
    .then(res => history.push('/login'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

/*
 * Login the user and get the JWT token
 */
export const loginUser = userData => dispatch => {
  axios
    .post(`${restApiUrl}/api/users/login`, userData)
    .then(res => {
      // Save the JWT token to local storage
      const { token } = res.data;
      localStorage.setItem('jwtToken', token);

      // Create an Authorize header cotaining the token
      setAuthToken(token);
      // Decode the token to get the user data
      const decodedToken = jwt_decode(token);
      // Set the current user
      dispatch(setCurrentUser(decodedToken));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

/*
 * Set the logged in user
 */
export const setCurrentUser = decodedToken => {
  return {
    type: SET_CURRENT_USER,
    payload: decodedToken
  };
};

/*
 * Log the user out
 */
export const logoutUser = () => dispatch => {
  // Remote the jwt token from local storage
  localStorage.removeItem('jwtToken');
  // Remove the authorization header for future requests
  setAuthToken(false);
  // Clear the current user
  dispatch(setCurrentUser({}));
};
