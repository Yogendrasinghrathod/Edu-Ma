import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';

import { authApi } from '@/features/api/authApi';
// console.log(authApi);

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware)
});

export default store;  // Change to default export