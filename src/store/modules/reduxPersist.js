import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

export default (reducers) => {
  const persistReducers = persistReducer(
    {
      key: 'CONSUMMING_API',
      storage,
      whitelist: ['auth'],
    },
    reducers
  );

  return persistReducers;
};
