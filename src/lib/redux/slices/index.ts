import authReducer from './authSlice';
import cartReducer from './shoppingCardSlice';


export {
  authReducer,
  cartReducer
};

export const reducers = {
  auth: authReducer,
  cart: cartReducer  
};