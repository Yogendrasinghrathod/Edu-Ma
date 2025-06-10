import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';

import { authApi } from '@/features/api/authApi';
import { courseApi } from '@/features/api/courseApi';
import { purchaseApi } from '@/features/api/purchaseApi';
// console.log(authApi);

const appStore = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware,courseApi.middleware,purchaseApi.middleware)
});

const initializeApp=async()=>{
  await appStore.dispatch(authApi.endpoints.loadUser.initiate({},{forceRefetch:true}))
}
initializeApp();
export default appStore;  // Change to default export