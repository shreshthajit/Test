import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: {},
    token: '',
    FirstTime: true,
    orderBbyId: {}
};


const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setToken: (state, action) => {
            state.token = action.payload;
        },
        // setCardDetails:(sate)
        logoutDoctor: (state, action) => {
            localStorage.clear()
            state.user = {};
            state.token = ''
            state.orderBbyId = {}
        },
    },

});



export const { setUser, logoutDoctor, Bording, setToken } = userSlice.actions;
export const authReducer = userSlice.reducer;