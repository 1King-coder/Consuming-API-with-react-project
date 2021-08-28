import { call, put, all, takeLatest } from 'redux-saga/effects';
import { get } from 'lodash';
import { toast } from 'react-toastify';

import * as actions from './actions';
import * as types from '../types';
import axios from '../../../services/axios';
import history from '../../../services/history';

// eslint-disable-next-line
function* loginRequest({ payload }) {
  try {
    const { email, password } = payload;
    const response = yield call(axios.post, '/tokens', { email, password });
    yield put(actions.loginSuccess({ ...response.data }));

    toast.success('Successfuly logged');

    axios.defaults.headers.Authorization = `Bearer ${response.data.token}`;

    history.push(payload.prevPath);
  } catch (error) {
    toast.error('User or password is invalid.');
    yield put(actions.loginFailure());
  }
}

function persistRehydrate({ payload }) {
  const token = get(payload, 'auth.token');
  if (!token) return;
  axios.defaults.headers.Authorization = `Bearer ${token}`;
}

export default all([
  takeLatest(types.LOGIN_REQUEST, loginRequest),
  takeLatest(types.PERSIST_REHYDRATE, persistRehydrate),
]);
