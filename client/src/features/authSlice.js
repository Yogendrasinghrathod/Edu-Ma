
import {createSlice} from '@reduxjs/toolkit';


const initialState = {
    user: null,
    // token: null,
    isAuthenticated: false,
    // loading: false,
    // error: null,
};

const authSlice = createSlice({
    name: 'authSlice',
    initialState,
    user:null,
    isAuthenticated:false,
    reducers:{
        userLoggedIn:(state, action)=>{
            state.user = action.payload.user;
            state.isAuthenticated = true;
        },
        userLoggedOut:(state)=>{
            state.user = null;
            state.isAuthenticated = false;
        }

    }
});


export const {userLoggedIn, userLoggedOut} = authSlice.actions;
export default authSlice.reducer;