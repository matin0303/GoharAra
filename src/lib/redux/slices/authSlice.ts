import { createSlice, PayloadAction ,createAsyncThunk} from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  role: string | null;
  isAuthenticated: boolean;
  // user: User | null;
}

const initialState: AuthState = {
  token: null,
  role : null,
  isAuthenticated: false,
};

const  authSlice = createSlice({
  name: 'auth', initialState,
  reducers: {

    setAuth : (state , action:PayloadAction<{token:string , role :string}>)=>{
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.isAuthenticated = true;

    },
     setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      
    },

    setRole: (state, action: PayloadAction<string>) => {
      state.role = action.payload;
    },

    clearAuth: (state) => {
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
    },

    updateAuth: (state, action: PayloadAction<Partial<AuthState>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setToken, clearAuth, updateAuth , setAuth } = authSlice.actions;

// selector 
export const selectToken = (state: { auth: AuthState }) => state.auth.token;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectRole = (state: { auth: AuthState }) => state.auth.role;


export default authSlice.reducer;