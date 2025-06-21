import {createSlice} from '@reduxjs/toolkit';


const initialState = {
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    // loading: false,
    // error: null,
};

const authSlice = createSlice({
    name: 'authSlice',
    initialState,
    reducers:{
        userLoggedIn:(state, action)=>{
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            localStorage.setItem('token', action.payload.token);
            console.log("✅ Redux: User logged in, state updated.");
        },
        userLoggedOut:(state)=>{
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
            console.log("✅ Redux: User logged out, state cleared.");
        }

    }
});


export const {userLoggedIn, userLoggedOut} = authSlice.actions;
export default authSlice.reducer;