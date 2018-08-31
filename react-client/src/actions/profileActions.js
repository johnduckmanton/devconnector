/*---------------------------------------------------------------------------------------------
 *  Copyright (c) John Duckmanton. Portions Copyright (c) 2018 Brad Traversey. 
 *  All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import axios from 'axios';

import {
  GET_PROFILE,
  GET_PROFILES,
  PROFILE_LOADING,
  CLEAR_CURRENT_PROFILE,
  GET_ERRORS,
  SET_CURRENT_USER
} from './types';

// Get API URL from Config
const restApiUrl = require('../config/env').restApiUrl;

/*
 * Get Current Profile
 */
export const getCurrentProfile = () => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get(`${restApiUrl}/api/profile`)
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        // Return an empty profile
        type: GET_PROFILE,
        payload: {}
      })
    );
};

/*
 * Get Current Profile by Handle
 */
export const getProfileByHandle = handle => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get(`${restApiUrl}/api/profile/handle/${handle}`)
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        // Return an empty profile
        type: GET_PROFILE,
        payload: null
      })
    );
};

/*
 * Create Profile
 */
export const createProfile = (profileData, history) => dispatch => {
  axios
    .post(`${restApiUrl}/api/profile`, profileData)
    .then(res => history.push('/dashboard'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

/*
 * Clear Profile
 */
export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE
  };
};

/*
 * Add Experience
 */
export const addExperience = (expData, history) => dispatch => {
  axios
    .post(`${restApiUrl}/api/profile/experience`, expData)
    .then(res => history.push('/dashboard'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

/*
 * Add Education
 */
export const addEducation = (eduData, history) => dispatch => {
  axios
    .post(`${restApiUrl}/api/profile/education`, eduData)
    .then(res => history.push('/dashboard'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

/*
 * Delete Experience
 */
export const deleteExperience = id => dispatch => {
  axios
    .delete(`${restApiUrl}/api/profile/experience/${id}`)
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

/*
 * Delete Education
 */
export const deleteEducation = id => dispatch => {
  axios
    .delete(`${restApiUrl}/api/profile/education/${id}`)
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

/*
 * Get all profiles
 */
export const getProfiles = () => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get(`${restApiUrl}/api/profile/all`)
    .then(res =>
      dispatch({
        type: GET_PROFILES,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PROFILES,
        payload: null
      })
    );
};

/*
 * Delete Account & Profile
 */
export const deleteAccount = () => dispatch => {
  if (window.confirm('Are you sure? This can NOT be undone!')) {
    axios
      .delete(`${restApiUrl}/api/profile`)
      .then(res => {
        dispatch({
          type: SET_CURRENT_USER,
          payload: {}
        });
      })
      .catch(err =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      );
  }
};

/*
 * Profile Loading
 */
export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING
  };
};
